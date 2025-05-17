import { NextResponse } from "next/server"

export async function GET() {
  // Check if the OpenAI API key is set in the environment variables
  const apiKeyAvailable = !!process.env.OPENAI_API_KEY

  return NextResponse.json({ available: apiKeyAvailable })
}
