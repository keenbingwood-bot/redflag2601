'use server'

import { analyzeJobDescriptionSchema, type AnalyzeJobDescriptionInput } from '@/lib/validations'
import { analyzeJobDescriptionWithAI, scrapeUrlWithJina } from '@/lib/ai-service'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function analyzeJobDescription(formData: FormData) {
  try {
    // Parse and validate input
    const rawInput = formData.get('input') as string
    const rawType = formData.get('type') as string

    const inputData: AnalyzeJobDescriptionInput = {
      input: rawInput.trim(),
      type: rawType as 'url' | 'text',
    }

    // Validate input
    const validatedInput = analyzeJobDescriptionSchema.parse(inputData)

    let jobDescriptionText: string

    // Step 1: Scrape URL or use text input
    if (validatedInput.type === 'url') {
      try {
        jobDescriptionText = await scrapeUrlWithJina(validatedInput.input)
      } catch (error) {
        throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } else {
      jobDescriptionText = validatedInput.input
    }

    // Step 2: Analyze with AI
    const aiAnalysis = await analyzeJobDescriptionWithAI(jobDescriptionText)

    // Step 3: Save to database (if available)
    let jobScan = null
    try {
      jobScan = await prisma.jobScan.create({
        data: {
          inputType: validatedInput.type,
          sourceUrl: validatedInput.type === 'url' ? validatedInput.input : null,
          content: jobDescriptionText,
          companyName: aiAnalysis.company_name,
          jobTitle: aiAnalysis.job_title,
          riskScore: aiAnalysis.overall_score,
          summary: aiAnalysis.summary,
          shareCopy: aiAnalysis.share_copy,
          flags: {
            create: aiAnalysis.red_flags.map(flag => ({
              severity: flag.severity,
              category: flag.category,
              quote: flag.quote,
              reality: flag.reality,
            })),
          },
        },
        include: {
          flags: true,
        },
      })
      console.log('Analysis saved to database')
    } catch (dbError) {
      console.warn('Database save failed, continuing without saving:', dbError)
      // Create a mock jobScan object for response
      jobScan = {
        id: 'mock-' + Date.now(),
        inputType: validatedInput.type,
        sourceUrl: validatedInput.type === 'url' ? validatedInput.input : null,
        content: jobDescriptionText,
        companyName: aiAnalysis.company_name,
        jobTitle: aiAnalysis.job_title,
        riskScore: aiAnalysis.overall_score,
        summary: aiAnalysis.summary,
        shareCopy: aiAnalysis.share_copy,
        flags: aiAnalysis.red_flags.map(flag => ({
          id: 'mock-flag-' + Date.now() + Math.random(),
          severity: flag.severity,
          category: flag.category,
          quote: flag.quote,
          reality: flag.reality,
        })),
      }
    }

    // Revalidate cache if needed
    revalidatePath('/')

    return {
      success: true,
      data: jobScan,
      message: 'Job description analyzed successfully',
      databaseSaved: jobScan.id.startsWith('mock-') ? false : true,
    }
  } catch (error) {
    console.error('Error analyzing job description:', error)

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to analyze job description',
      }
    }

    return {
      success: false,
      error: 'Unknown error occurred',
      message: 'Failed to analyze job description',
    }
  }
}