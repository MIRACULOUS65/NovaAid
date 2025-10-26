import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    clerkPublicKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
    clerkSecretKey: process.env.CLERK_SECRET_KEY ? "✅ Set" : "❌ Missing",
    mongodbUri: process.env.MONGODB_URI ? "✅ Set" : "❌ Missing",
  });
}
