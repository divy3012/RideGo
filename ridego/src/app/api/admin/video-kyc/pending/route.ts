import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorized" }, { status: 400 });
    }
    const partner = await User.find({
      role: "partner",
      partnerOnboardingSteps: 4,
      videoKycStatus: { $in: ["pending", "in_progress"] },
    });
    return Response.json(partner, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `video kyc get error ${error}` },
      { status: 500 },
    );
  }
}
