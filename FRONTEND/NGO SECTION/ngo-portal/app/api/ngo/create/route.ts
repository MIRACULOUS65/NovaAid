import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import NGO from "@/models/NGO";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // Check MongoDB URI first
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined in environment variables");
      return NextResponse.json(
        { message: "Server configuration error: Database connection not configured. Please set MONGODB_URI in .env.local" },
        { status: 500 }
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();

    // Check if NGO already exists for this user
    const existingNGO = await NGO.findOne({ userId });
    if (existingNGO) {
      return NextResponse.json(
        { message: "NGO profile already exists for this user" },
        { status: 400 }
      );
    }

    // Create new NGO profile
    const ngo = await NGO.create({
      userId,
      ...body,
    });

    return NextResponse.json(
      {
        message: "NGO profile created successfully",
        ngo: {
          id: ngo._id,
          ngoName: ngo.ngoName,
          email: ngo.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating NGO profile:", error);
    
    // Provide more specific error messages
    let errorMessage = "Internal server error";
    if (error.message?.includes("MONGODB_URI")) {
      errorMessage = "Database connection not configured. Please check .env.local file";
    } else if (error.name === "MongoServerError") {
      errorMessage = "Database error: " + error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { message: errorMessage, error: error.message },
      { status: 500 }
    );
  }
}
