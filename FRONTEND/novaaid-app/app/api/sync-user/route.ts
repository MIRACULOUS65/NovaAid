import { auth, currentUser } from '@clerk/nextjs/server';
import { getFirebaseAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const db = getFirebaseAdmin();

    const userData = {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      imageUrl: user.imageUrl || '',
      updatedAt: new Date().toISOString(),
    };

    // Check if user exists
    const userDoc = await db.collection('users').doc(user.id).get();
    
    if (!userDoc.exists) {
      // Create new user with createdAt
      await db.collection('users').doc(user.id).set({
        ...userData,
        createdAt: new Date().toISOString(),
      });
    } else {
      // Update existing user
      await db.collection('users').doc(user.id).update(userData);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User synced successfully'
    });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
