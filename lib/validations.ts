import { z } from 'zod'

// Input validation for job description analysis
export const analyzeJobDescriptionSchema = z.object({
  input: z.string().min(10, 'Input must be at least 10 characters').max(10000, 'Input too long'),
  type: z.enum(['url', 'text']),
})

export type AnalyzeJobDescriptionInput = z.infer<typeof analyzeJobDescriptionSchema>

// Validation for LLM response
export const riskFlagSchema = z.object({
  severity: z.enum(['High', 'Medium', 'Low']),
  category: z.enum(['Culture', 'Compensation', 'Workload', 'Management', 'Stability']),
  quote: z.string(),
  reality: z.string(),
})

export const llmAnalysisResponseSchema = z.object({
  company_name: z.string().nullable(),
  job_title: z.string().nullable(),
  overall_score: z.number().min(0).max(100),
  summary: z.string(),
  red_flags: z.array(riskFlagSchema),
  share_copy: z.string().optional(),
})

export type LLMAnalysisResponse = z.infer<typeof llmAnalysisResponseSchema>
export type RiskFlag = z.infer<typeof riskFlagSchema>