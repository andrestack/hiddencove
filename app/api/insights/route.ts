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
You are SalonAI, a senior colour-specialist mentor.

INPUT
• question: the single consultation question shown to the client
• context: one–sentence description from the knowledge base (e.g. "Discuss maintenance for blonde roots.")

TASK
Return a JSON object with two keys:
{
  "insight": "<natural, ≤ 15 words>",
  "follow_up": "<probing question, ≤ 15 words>"
}

STYLE & CONTENT RULES
1. Speak like a quick pro tip; never echo the original question.
2. Replace any "XYZ" placeholder with concrete, professional advice.
3. Be specific when maintenance is mentioned (e.g. time frames, product types, techniques).
4. Use friendly salon language clients understand ("toner refresh", "bond-builder treatment").
5. A good follow-up probe digs deeper or clarifies commitment, technique, or expectations.
6. Avoid brand names and jargon the average client wouldn't know.

DOMAIN CHEAT-SHEET (draw on these when relevant)
• Blonde to the roots → regrowth fast; toner or foils every 6–8 weeks, purple shampoo weekly.  
• Face-frame intensity → subtle foils = softer grow-out; bold money-piece needs gloss every 8 weeks.  
• Dimension in mids → lowlights deepen tone; suggest pigmented conditioner fortnightly for richness.  
• Fragile ends → bond-builder before lightening; trim dry ends first to protect integrity.  
• Tank water / mineral build-up → chelating shampoo monthly keeps colour true.  
• Home toning commitment → purple mask weekly for cool blondes; copper mask bi-weekly for warmth.

EXAMPLES
Input question: "Do you like how blonde it is to the roots? Maintenance would be XYZ"
Output →
{
  "insight": "Expect toner + foils every 6–8 weeks; use purple shampoo to mute brass.",
  "follow_up": "How often can you return for root touch-ups to keep regrowth unseen?"
}

Input question: "When hair is tied back it will look like xyz and maintenance would be xyz"
Output →
{
  "insight": "Soft balayage panels melt smoothly when tied up; refresh gloss every two months.",
  "follow_up": "Do you prefer low-maintenance softness or bolder contrast when your hair's up?"
}


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
        return NextResponse.json(
          { insight: "No insight could be generated at this moment.", follow_up: "" },
          { status: 200 }
        )
      }
      // Try to parse the AI message as JSON
      try {
        const parsed = JSON.parse(aiMessage)
        return NextResponse.json({
          insight: parsed.insight || "No insight generated.",
          follow_up: parsed.follow_up || "",
        })
      } catch {
        // If parsing fails, return the whole message as 'insight' and empty follow_up
        return NextResponse.json({
          insight: aiMessage,
          follow_up: "",
        })
      }
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
