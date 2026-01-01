import OpenAI from 'openai'
import { llmAnalysisResponseSchema, type LLMAnalysisResponse } from './validations'

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

// Initialize OpenAI client for DeepSeek API (lazy initialization)
let openai: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY is not set in environment variables')
    }

    openai = new OpenAI({
      baseURL: DEEPSEEK_API_URL,
      apiKey: DEEPSEEK_API_KEY,
    })
  }
  return openai
}

// System prompt for job description risk analysis
const SYSTEM_PROMPT = `Role: You are analyzing job descriptions for potential risks.
Objective: Analyze the Job Description to identify potential risks (Red Flags) regarding work-life balance, toxicity, stability, or compensation.
Tone: Professional, objective, and clear. NOT humorous, NOT mocking.

Output: Return ONLY a valid JSON object with this structure:
{
  "company_name": "Name found in text or null",
  "job_title": "Job title found in text or null",
  "overall_score": (Integer 0-100, where 100 is perfectly safe, 0 is a scam),
  "summary": "A one-sentence punchy warning or summary of the vibe.",
  "red_flags": [
    {
      "severity": "High" | "Medium" | "Low",
      "category": "Culture" | "Workload" | "Compensation" | "Management" | "Stability",
      "quote": "Exact phrase from JD triggering this flag",
      "reality": "Brief explanation of the hidden meaning/risk"
    }
  ],
  "share_copy": "A short, witty first-person sentence for social media sharing (e.g., 'I scanned this JD and found...')."
}`

export async function analyzeJobDescriptionWithAI(jobDescription: string): Promise<LLMAnalysisResponse> {
  try {
    const client = getOpenAIClient()
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Input Text: ${jobDescription}` },
      ],
      temperature: 0.3, // Lower temperature for more consistent, professional output
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from AI')
    }

    // Parse and validate the response
    const parsedResponse = JSON.parse(responseText)
    const validatedResponse = llmAnalysisResponseSchema.parse(parsedResponse)

    return validatedResponse
  } catch (error) {
    console.error('AI analysis failed:', error)

    // Fallback response in case of AI failure
    return {
      company_name: null,
      job_title: null,
      overall_score: 50,
      summary: 'Unable to analyze this job description. Please try again or paste the text directly.',
      red_flags: [],
      share_copy: 'I tried to scan this JD but encountered an issue.',
    }
  }
}

// Jina Reader API for URL scraping
export async function scrapeUrlWithJina(url: string): Promise<string> {
  try {
    const jinaApiKey = process.env.JINA_READER_API_KEY
    const apiUrl = `https://r.jina.ai/${url}`

    const headers: HeadersInit = {
      'Accept': 'text/plain',
    }

    if (jinaApiKey) {
      headers['Authorization'] = `Bearer ${jinaApiKey}`
    }

    const response = await fetch(apiUrl, { headers })

    if (!response.ok) {
      throw new Error(`Jina Reader failed with status: ${response.status}`)
    }

    const content = await response.text()
    return content
  } catch (error) {
    console.error('URL scraping failed:', error)
    throw new Error('Failed to fetch content from URL. Please try pasting the text directly.')
  }
}