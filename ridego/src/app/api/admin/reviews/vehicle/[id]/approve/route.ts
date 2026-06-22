import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }
    await connectDB();
    const vehicleId = (await context.params).id;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 400 },
      );
    }
    vehicle.status = "approved";
    vehicle.rejectionReason = undefined;
    await vehicle.save();

    const partner = await User.findById(vehicle.owner);
    if (!partner) {
      return NextResponse.json(
        { message: "Partner Not Found" },
        { status: 200 },
      );
    }
    partner.partnerOnboardingSteps = 7;
    await partner.save();
    return NextResponse.json(vehicle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `vehicle approve error ${error}` },
      { status: 500 },
    );
  }
}
