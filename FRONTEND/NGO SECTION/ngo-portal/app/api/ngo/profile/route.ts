import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import NGO from "@/models/NGO";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
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

    const ngo = await NGO.findOne({ userId });

    if (!ngo) {
      return NextResponse.json(
        { exists: false, message: "NGO profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        exists: true,
        ngo: {
          id: ngo._id,
          userId: ngo.userId,
          ngoName: ngo.ngoName,
          registrationNumber: ngo.registrationNumber,
          email: ngo.email,
          phone: ngo.phone,
          address: ngo.address,
          city: ngo.city,
          state: ngo.state,
          country: ngo.country,
          zipCode: ngo.zipCode,
          website: ngo.website,
          description: ngo.description,
          foundedYear: ngo.foundedYear,
          focusAreas: ngo.focusAreas,
          createdAt: ngo.createdAt,
          updatedAt: ngo.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching NGO profile:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const ngo = await NGO.findOneAndUpdate(
      { userId },
      { ...body },
      { new: true, runValidators: true }
    );

    if (!ngo) {
      return NextResponse.json(
        { message: "NGO profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "NGO profile updated successfully",
        ngo: {
          id: ngo._id,
          ngoName: ngo.ngoName,
          email: ngo.email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating NGO profile:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
