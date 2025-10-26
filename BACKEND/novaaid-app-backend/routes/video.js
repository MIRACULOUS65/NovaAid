import express from 'express';
import axios from 'axios';
import { authMiddleware } from '../middleware/auth.js';
import { getAuthFirestore } from '../config/firebase.js';

const router = express.Router();

/**
 * POST /api/video/create
 * Body: { roomName: string, resourceId?: string }
 *
 * - Verifies request via authMiddleware (must set req.user)
 * - Confirms req.user.publicMetadata.activeRole is 'user' or 'ngo'
 * - Optional: checks permission to resourceId (alert/case) in Firestore
 * - Creates room (idempotent) and creates a meeting token
 */
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    // Get user role from public metadata
    const currentRole = user?.publicMetadata?.activeRole || 
                       user?.public_metadata?.activeRole ||
                       user?.metadata?.activeRole ||
                       user?.activeRole;
    
    // Verify user role (optional: comment out if role check not needed)
    if (!['user', 'ngo'].includes(currentRole)) {
      return res.status(403).json({ 
        error: 'Only user or ngo may create/join rooms'
      });
    }

    const { roomName, resourceId } = req.body;
    if (!roomName) {
      return res.status(400).json({ error: 'roomName required' });
    }

    // OPTIONAL: permission checks
    // If resourceId provided, ensure user is owner or NGO assigned to it
    if (resourceId) {
      try {
        const db = getAuthFirestore();
        const alertDoc = await db.collection('alerts').doc(resourceId).get();
        
        if (!alertDoc.exists) {
          return res.status(404).json({ error: 'Resource not found' });
        }
        
        const alertData = alertDoc.data();
        
        // Check permissions based on role
        if (currentRole === 'user') {
          // User must be the owner of the alert
          if (alertData.requesterId !== user.sub && alertData.userId !== user.sub) {
            return res.status(403).json({ error: 'Not authorized: not the alert owner' });
          }
        } else if (currentRole === 'ngo') {
          // NGO must be assigned to this alert
          if (alertData.assignedNgoId !== user.sub && alertData.ngoId !== user.sub) {
            return res.status(403).json({ error: 'Not authorized: NGO not assigned to this alert' });
          }
        }
      } catch (dbError) {
        console.error('Database permission check error:', dbError);
        // Continue without strict permission check if DB error (fallback for dev)
        console.warn('Continuing without strict permission check due to DB error');
      }
    }

    const dailyApiKey = process.env.DAILY_API_KEY;
    if (!dailyApiKey) {
      return res.status(500).json({ error: 'DAILY_API_KEY not configured' });
    }

    const dailyBaseUrl = process.env.DAILY_BASE_URL || 'https://api.daily.co';

    // 1) Create room (idempotent). If exists, Daily returns the existing room.
    try {
      const roomResponse = await axios.post(
        `${dailyBaseUrl}/v1/rooms`,
        {
          name: roomName,
          properties: {
            enable_chat: true,
            enable_screenshare: true,
            start_video_off: false,
            start_audio_off: false
            // Note: enable_recording removed - not available on free plan
          }
        },
        {
          headers: {
            Authorization: `Bearer ${dailyApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const roomData = roomResponse.data;

      // 2) Create meeting token
      // Set token expiry short (e.g. exp = now + 3600 seconds = 1 hour)
      const nowSec = Math.floor(Date.now() / 1000);
      const tokenBody = {
        properties: {
          room_name: roomName,
          user_name: user.email || user.sub || 'User',
          // Expire 1 hour from now
          exp: nowSec + 60 * 60,
          enable_screenshare: true
          // Note: enable_recording removed - not available on free plan
        }
      };

      const tokenResponse = await axios.post(
        `${dailyBaseUrl}/v1/meeting-tokens`,
        tokenBody,
        {
          headers: {
            Authorization: `Bearer ${dailyApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const tokenData = tokenResponse.data;

      return res.json({
        success: true,
        room: roomData,
        token: tokenData.token
      });
    } catch (dailyError) {
      // If room already exists, Daily returns 400 or 409
      if (dailyError.response?.status === 400 || dailyError.response?.status === 409) {
        // Room exists, try to get it and create token
        try {
          const roomGetResponse = await axios.get(
            `${dailyBaseUrl}/v1/rooms/${roomName}`,
            {
              headers: {
                Authorization: `Bearer ${dailyApiKey}`
              }
            }
          );

          const roomData = roomGetResponse.data;

          // Create meeting token for existing room
          const nowSec = Math.floor(Date.now() / 1000);
          const tokenBody = {
            properties: {
              room_name: roomName,
              user_name: user.email || user.sub || 'User',
              exp: nowSec + 60 * 60,
              enable_screenshare: true
              // Note: enable_recording removed - not available on free plan
            }
          };

          const tokenResponse = await axios.post(
            `${dailyBaseUrl}/v1/meeting-tokens`,
            tokenBody,
            {
              headers: {
                Authorization: `Bearer ${dailyApiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const tokenData = tokenResponse.data;

          return res.json({
            success: true,
            room: roomData,
            token: tokenData.token
          });
        } catch (retryError) {
          console.error('Daily room fetch/token retry failed:', retryError.response?.data || retryError.message);
          return res.status(500).json({ 
            error: 'Failed to access existing room', 
            details: JSON.stringify(retryError.response?.data || retryError.message)
          });
        }
      }

      console.error('Daily API error:', dailyError.response?.data || dailyError.message);
      return res.status(500).json({ 
        error: 'Failed to create room/token', 
        details: JSON.stringify(dailyError.response?.data || dailyError.message)
      });
    }
  } catch (err) {
    console.error('video.create error:', err.message, err.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: err.message
    });
  }
});

/**
 * DELETE /api/video/room/:roomName
 * Deletes/closes a Daily room (admin only or authorized users)
 */
router.delete('/room/:roomName', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const currentRole = user?.publicMetadata?.activeRole || user?.public_metadata?.activeRole;
    
    if (!['user', 'ngo', 'admin'].includes(currentRole)) {
      return res.status(403).json({ error: 'Not authorized to delete rooms' });
    }

    const { roomName } = req.params;
    const dailyApiKey = process.env.DAILY_API_KEY;
    const dailyBaseUrl = process.env.DAILY_BASE_URL || 'https://api.daily.co';

    await axios.delete(
      `${dailyBaseUrl}/v1/rooms/${roomName}`,
      {
        headers: {
          Authorization: `Bearer ${dailyApiKey}`
        }
      }
    );

    return res.json({
      success: true,
      message: `Room ${roomName} deleted successfully`
    });
  } catch (err) {
    console.error('video.delete error:', err);
    return res.status(500).json({ 
      error: 'Failed to delete room',
      details: err.response?.data 
    });
  }
});

export default router;
