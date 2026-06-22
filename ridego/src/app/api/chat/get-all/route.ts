import connectDB from "@/lib/db";
import ChatMessage from "@/models/chatMessage.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { bookingId, sender, text } = await req.json();
    const msg = await ChatMessage.find({ bookingId });
    return NextResponse.json(msg, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get all message error ${error}` },
      { status: 500 },
    );
  }
}
