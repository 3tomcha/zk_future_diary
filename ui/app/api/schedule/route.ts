import { NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai";

// require('dotenv').config();
console.log(process.env.OPENAI_API_KEY)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function completion(prompt: string) {
  const _completaion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  })
  console.log(_completaion)
  console.log(_completaion.choices[0])
  return _completaion.choices[0]
}

export async function GET(req: NextRequest) {
  // クエリパラメータの取得
  const url = req.nextUrl;
  const prompt = url.searchParams.get('prompt') ?? ""
  const _completion = await completion(prompt)

  return NextResponse.json(
    _completion,
    { status: 200 }
  );
}