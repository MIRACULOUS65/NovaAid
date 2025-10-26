import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeFirebase } from './config/firebase.js';
import commitmentRoutes from './routes/commitment.js';
import merkleRoutes from './routes/merkle.js';
import verificationRoutes from './routes/verification.js';
import videoRoutes from './routes/video.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Firebase Admin
initializeFirebase();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'NovaAid Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      commitment: '/api/commitment',
      merkle: '/api/merkle',
      verification: '/api/verification',
      video: '/api/video'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/commitment', commitmentRoutes);
app.use('/api/merkle', merkleRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/video', videoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`NovaAid Backend Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
