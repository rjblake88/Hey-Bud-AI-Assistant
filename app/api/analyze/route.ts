import { NextResponse } from "next/server"
import { OpenAI } from "openai"

export async function POST(request: Request) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY

    // Check if we have an API key from environment variables
    if (!apiKey) {
      // Try to get the API key from the request headers
      const authHeader = request.headers.get("Authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "OpenAI API key is missing. Please set your API key." }, { status: 401 })
      }
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey || request.headers.get("Authorization")?.replace("Bearer ", "") || "",
    })

    // Get the text from the request
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Extract any tasks or to-do items from the text. Format each task on a new line. If there are no tasks, respond with 'No tasks found.'",
        },
        {
          role: "user",
          content: `Extract tasks from: "${text}"`,
        },
      ],
    })

    const analysis = response.choices[0]?.message.content || "No tasks found."

    // Split the analysis by new lines and filter out empty lines
    const todos = analysis
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && line !== "No tasks found.")

    return NextResponse.json({ todos })
  } catch (error) {
    console.error("Error analyzing text:", error)
    return NextResponse.json(
      { error: "Failed to analyze text: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
