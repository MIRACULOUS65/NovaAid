import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role } = await req.json();

    if (!role || !["user", "ngo"].includes(role)) {
      return NextResponse.json(
        { message: "Invalid role. Must be 'user' or 'ngo'" },
        { status: 400 }
      );
    }

    // Update user's public metadata with active role
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        activeRole: role,
        lastRoleChange: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        message: "Role set successfully",
        role,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error setting role:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
