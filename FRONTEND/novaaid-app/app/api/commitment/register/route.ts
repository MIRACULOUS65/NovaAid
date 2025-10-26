import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commitment } = await request.json();

    if (!commitment) {
      return NextResponse.json({ error: 'Commitment is required' }, { status: 400 });
    }

    // Forward to backend service
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/commitment/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}` // In production, use proper JWT
      },
      body: JSON.stringify({ commitment, userId })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error registering commitment:', error);
    return NextResponse.json(
      { error: 'Failed to register commitment' },
      { status: 500 }
    );
  }
}
