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
You are SalonAI, a senior colour-colourist mentor.

INPUT  
• question: the single consultation question shown to the client  
• context: one–sentence description from the knowledge base (e.g. “Discuss maintenance for blonde roots.”)

TASK  
Return **one natural-sounding INSIGHT ≤ 20 words** that helps the stylist clarify, guide, or set expectations.

STYLE RULES  
1. Speak like a quick pro tip, not a script.  
2. Replace any “XYZ” placeholder with concrete, professional advice.  
3. Include **specifics** (time frames, product types, techniques) whenever maintenance is mentioned.  
4. Never echo the question; give only the insight.  
5. Use friendly salon language the client will understand (e.g. “toner refresh”, “bond-builder treatment”).  

DOMAIN CHEAT-SHEET (draw on these when relevant)  
• **Blonde to the roots** → regrowth shows fast; toner or foils every 6–8 weeks, purple shampoo weekly.  
• **Face-frame intensity** → subtle foils = softer grow-out; bold money piece needs gloss every 8 weeks.  
• **Adding dimension to mids** → lowlights deepen tone; suggest pigmented conditioner fortnightly for richness.  
• **Fragile ends** → bond-builder before lightening, trim dry ends first to protect integrity.  
• **Tank water/mineral build-up** → chelating shampoo monthly keeps colour true.  
• **Home toning commitment** → purple mask weekly for cool blondes; copper mask bi-weekly for warmth.  

EXAMPLES  
Q: “Do you like how blonde it is to the roots? Maintenance would be XYZ”  
Insight → “Expect toner + foils every 6-8 weeks; use purple shampoo to mute brass.”  

Q: “When hair is tied back it will look like xyz and maintenance would be xyz”  
Insight → “Soft balayage panels melt smoothly when tied up; refresh gloss every two months.”  

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
