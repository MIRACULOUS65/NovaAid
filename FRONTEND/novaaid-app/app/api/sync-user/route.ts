import { auth, currentUser } from '@clerk/nextjs/server';
import { getFirebaseAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('[Sync User] Starting sync...');
    
    const { userId } = await auth();
    console.log('[Sync User] User ID:', userId);
    
    if (!userId) {
      console.error('[Sync User] No user ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    console.log('[Sync User] Current user:', user?.id, user?.firstName, user?.lastName);
    
    if (!user) {
      console.error('[Sync User] User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('[Sync User] Initializing Firebase Admin...');
    console.log('[Sync User] Environment check:', {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    const db = getFirebaseAdmin();
    console.log('[Sync User] Firebase Admin initialized');

    const userData = {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      imageUrl: user.imageUrl || '',
      updatedAt: new Date().toISOString(),
    };
    console.log('[Sync User] User data to sync:', userData);

    // Check if user exists
    console.log('[Sync User] Checking if user exists in Firestore...');
    const userDoc = await db.collection('users').doc(user.id).get();
    console.log('[Sync User] User exists:', userDoc.exists);
    
    if (!userDoc.exists) {
      // Create new user with createdAt
      console.log('[Sync User] Creating new user document...');
      await db.collection('users').doc(user.id).set({
        ...userData,
        createdAt: new Date().toISOString(),
      });
      console.log('[Sync User] User created successfully');
    } else {
      // Update existing user
      console.log('[Sync User] Updating existing user document...');
      await db.collection('users').doc(user.id).update(userData);
      console.log('[Sync User] User updated successfully');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User synced successfully',
      userData 
    });
  } catch (error: any) {
    console.error('[Sync User] Error syncing user:', error);
    console.error('[Sync User] Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
