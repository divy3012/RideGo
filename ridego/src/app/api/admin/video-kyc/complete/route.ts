import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }

    const { roomId, action, reason } = await req.json();
    if (!roomId) {
      return NextResponse.json(
        { message: "room id is required" },
        { status: 400 },
      );
    }

    if (!["approved", "rejected"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
    const partner = await User.findOne({
      videoKycRoomId: roomId,
      role: "partner",
    });
    if (!partner) {
      return NextResponse.json(
        { message: "Partner Not Found" },
        { status: 400 },
      );
    }
    if (action === "approved") {
      partner.videoKycStatus = "approved";
      partner.videoKycRejectionReason = undefined;
      partner.partnerOnboardingSteps = 5;
    }
    if (action === "rejected") {
      if (!reason) {
        return Response.json(
          { message: "rejection reason  is required" },
          { status: 400 },
        );
      }
      partner.videoKycStatus = "rejected";
      partner.videoKycRejectionReason = reason.trim();
    }
    await partner.save();
    return Response.json({ status: partner.videoKycStatus }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `kyc complete error ${error}` },
      { status: 500 },
    );
  }
}
