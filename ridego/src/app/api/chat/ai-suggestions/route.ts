import connectDB from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const geminiUrl = process.env.GEMINI_API_URL!;

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { lastMessage, role } = await req.json();
    const prompt = `You are an AI reply suggestion system for a vehicle booking chat app.

Generate short, smart, human-like quick reply suggestions based on:
- ROLE (DRIVER or USER)
- RECENT_MESSAGE

Rules:
- Return exactly 6 suggestions
- Keep replies short (3-12 words)
- Match the conversation context and tone
- Driver replies should sound professional and helpful
- User replies should sound natural and realistic
- Avoid repetition
- Return ONLY valid JSON

Output format:
{
  "suggestions": [
    "Reply 1",
    "Reply 2",
    "Reply 3",
    "Reply 4",
    "Reply 5",
    "Reply 6"
  ]
}

Input:
ROLE: ${role}
RECENT_MESSAGE: ${lastMessage}
`;
    const response = await axios.post(geminiUrl, {
      contents: [
        {
          parts: [
            {
              text: `${prompt}`,
            },
          ],
        },
      ],
    });
    const suggestions = response.data.candidates[0].content.parts[0].text;
    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `get all ai suggestions  error ${error}` },
      { status: 500 },
    );
  }
}
