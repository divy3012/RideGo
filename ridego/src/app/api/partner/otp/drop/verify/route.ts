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
    if (!booking.dropOtp) {
      return NextResponse.json(
        { message: "drop otp is not generated!" },
        { status: 400 },
      );
    }

    if (booking.dropOtp !== otp) {
      return NextResponse.json(
        { message: "incorrect drop otp " },
        { status: 400 },
      );
    }

    if (booking.dropOtpExpire < new Date()) {
      return NextResponse.json(
        { message: "drop otp expired!" },
        { status: 400 },
      );
    }
    if (booking.paymentStatus === "cash") {
      const adminCommission = booking.fare * 0.1;
      const partnerAmount = booking.fare - adminCommission;
      booking.adminCommission = adminCommission;
      booking.partnerAmount = partnerAmount;
    }
    booking.paymentStatus = "paid";
    booking.paymentDeadline = undefined;
    booking.bookingStatus = "completed";
    booking.dropOtp = "";
    booking.dropOtpExpire = undefined;
    await booking.save();

    return NextResponse.json({ message: "drop otp verified" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `drop otp verify error ${error}` },
      { status: 500 },
    );
  }
}
