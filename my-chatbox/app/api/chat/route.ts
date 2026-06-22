
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    // Sahi stable model ka naam yahan likhein
    model: google("gemini-2.5-flash"), 
    messages,
  });

  return result.toTextStreamResponse();
}