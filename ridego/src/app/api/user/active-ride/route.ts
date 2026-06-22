import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }
    const { bookingId } = await req.json();
    const bookimg = await Booking.findById(bookingId).populate(
      "user vehicle driver",
    );
    return NextResponse.json(bookimg, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { messsage: `get active ride for user err ${error}` },
      { status: 500 },
    );
  }
}
