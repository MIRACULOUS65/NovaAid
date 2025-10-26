import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { blockchainDb } from '@/lib/firebase/blockchain';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check verification status in blockchain ZK database
    const userDoc = await getDoc(doc(blockchainDb, 'users', userId));
    
    if (!userDoc.exists()) {
      return NextResponse.json({ verified: false });
    }

    const userData = userDoc.data();
    
    return NextResponse.json({
      verified: userData.verified || false,
      verifiedAt: userData.verifiedAt || null
    });
  } catch (error) {
    console.error('Error checking verification status:', error);
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    );
  }
}
