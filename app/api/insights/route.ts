import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const basePrompt = `
You are a helpful assistant that can provide smart insights to a hairstylist assessing a client's preference.
The goal is to:
- Help the hairstylist to cover all aspects of the colouring needs of the client
- Understand the client's preferences
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userPrompt }],
      max_tokens: 60,
      temperature: 0.7,
    })
    const aiMessage = response.choices[0]?.message?.content?.trim() || "No insight generated."
    return NextResponse.json({ insight: aiMessage })
  } catch {
    return NextResponse.json({ error: "Failed to generate insight." }, { status: 500 })
  }
}
