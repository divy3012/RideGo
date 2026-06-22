import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }
    const { reason } = await req.json();
    await connectDB();
    const vehicleId = (await context.params).id;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 400 },
      );
    }
    vehicle.status = "rejected";
    vehicle.rejectionReason = reason;
    await vehicle.save();
    return Response.json(vehicle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `vehicle rejected error ${error}` },
      { status: 500 },
    );
  }
}
