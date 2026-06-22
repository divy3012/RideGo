import connectDB from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { bookingId, otp } = await req.json();
    const booking = await Booking.findById(bookingId).populate("user");
    if (!booking) {
      return NextResponse.json(
        { message: "Booking Not Found" },
        { status: 400 },
      );
    }
    if (!booking.pickUpOtp) {
      return NextResponse.json(
        { message: "pickUp otp is not generated!" },
        { status: 400 },
      );
    }

    if (booking.pickUpOtp !== otp) {
      return NextResponse.json(
        { message: "incorrect pickUp otp " },
        { status: 400 },
      );
    }

    if (booking.pickUpOtpExpire < new Date()) {
      return NextResponse.json(
        { message: "pickUp otp expired!" },
        { status: 400 },
      );
    }
    booking.bookingStatus = "started";
    booking.pickUpOtp = "";
    booking.pickUpOtpExpire = undefined;
    await booking.save();

    return NextResponse.json(
      { message: "pick uo otp verified" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `pick up otp verify error ${error}` },
      { status: 500 },
    );
  }
}
