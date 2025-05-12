import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable")
  throw new Error("Missing OPENAI_API_KEY environment variable. Please check your .env.local file.")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const basePrompt = `
You are a helpful assistant that can provide smart insights to a hairstylist assessing a client\'s preference.
The goal is to:
- Help the hairstylist to cover all aspects of the colouring needs of the client
- Understand the client\'s preferences
- Provide a better and more personalised service.
You will be given a question and its context.
You will provide a smart insight no longer than 15 words.
`

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json()
    if (!question || !context) {
      return NextResponse.json({ error: "Missing question or context" }, { status: 400 })
    }

    const userPrompt = `${basePrompt}\nQuestion: ${question}\nContext: ${context}\nInsight:`

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: userPrompt }],
        max_tokens: 60,
        temperature: 0.7,
      })

      const aiMessage = response.choices[0]?.message?.content?.trim()
      if (!aiMessage) {
        console.error("OpenAI API returned an empty message.")
        // Return a success response with a specific message, or a 500 if this case is considered a server error.
        return NextResponse.json(
          { insight: "No insight could be generated at this moment." },
          { status: 200 }
        )
      }
      return NextResponse.json({ insight: aiMessage })
    } catch (openaiError: unknown) {
      let errorMessage = "Failed to generate insight due to an OpenAI API error."
      let errorStatus = 500
      let errorDetails = "Unknown OpenAI API error"

      if (openaiError instanceof Error) {
        errorDetails = openaiError.message
        // Check for specific OpenAI error properties if needed, after confirming it's an OpenAI error object
        // For example, if OpenAI errors have a 'status' property:
        // if ('status' in openaiError && typeof openaiError.status === 'number') {
        //   errorStatus = openaiError.status;
        // }
      }
      console.error("OpenAI API Error:", errorDetails, openaiError)

      // More specific error messages based on potential OpenAI error structures
      if (typeof openaiError === "object" && openaiError !== null) {
        if ("status" in openaiError && openaiError.status === 401) {
          errorMessage =
            "OpenAI API request failed due to an authentication error (invalid API key or insufficient permissions)."
          errorStatus = 401
        } else if ("status" in openaiError && openaiError.status === 429) {
          errorMessage = "OpenAI API request failed due to rate limiting. Please try again later."
          errorStatus = 429
        } else if (errorDetails.includes("model_not_found")) {
          errorMessage =
            "OpenAI API request failed because the specified model was not found. Please check the model name."
        }
      }

      return NextResponse.json(
        { error: errorMessage, details: errorDetails },
        { status: errorStatus }
      )
    }
  } catch (error: unknown) {
    let requestProcessingErrorDetails = "Unknown error processing request"
    if (error instanceof Error) {
      requestProcessingErrorDetails = error.message
    }
    console.error("Request processing error:", requestProcessingErrorDetails, error)
    return NextResponse.json(
      { error: "Failed to process request.", details: requestProcessingErrorDetails },
      { status: 500 }
    )
  }
}
