import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { blockchainDb } from '@/lib/firebase/blockchain';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { txHash, amount, walletAddress } = await request.json();

    if (!txHash || !amount || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create verification record in verifications collection
    const verificationData = {
      clerkId: userId,
      txHash,
      amount,
      walletAddress,
      verified: true,
      verifiedAt: new Date().toISOString()
    };
    
    await addDoc(collection(blockchainDb, 'verifications'), verificationData);

    // Create or update user document with verification status (using set with merge)
    await setDoc(doc(blockchainDb, 'users', userId), {
      clerkId: userId,
      verified: true,
      verifiedAt: new Date().toISOString(),
      verificationTxHash: txHash,
      verificationAmount: amount,
      verificationWallet: walletAddress,
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({
      success: true,
      verified: true
    });
  } catch (error) {
    console.error('Error recording verification:', error);
    return NextResponse.json(
      { 
        error: 'Failed to record verification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
