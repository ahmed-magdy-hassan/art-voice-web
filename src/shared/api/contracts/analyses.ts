import { z } from 'zod'

export const AnalysisType = z.enum(['call', 'training', 'live'])
export type AnalysisType = z.infer<typeof AnalysisType>

export const AnalysisListItem = z.object({
  id: z.string(),
  type: AnalysisType,
  title: z.string(),
  createdAt: z.string(),
  durationSeconds: z.number().nonnegative(),
  score: z.number().min(0).max(100).nullable(),
})
export type AnalysisListItem = z.infer<typeof AnalysisListItem>

export const AnalysisListResponse = z.object({
  items: z.array(AnalysisListItem),
  nextCursor: z.string().nullable(),
  total: z.number().int().nonnegative(),
})
export type AnalysisListResponse = z.infer<typeof AnalysisListResponse>

// UC-19.15 query parameters.
export const AnalysisListQuery = z.object({
  cursor: z.string().optional(),
  type: AnalysisType.optional(),
  minScore: z.number().min(0).max(100).optional(),
  maxScore: z.number().min(0).max(100).optional(),
  from: z.string().optional(), // ISO date
  to: z.string().optional(),
  sort: z.enum(['date_desc', 'date_asc', 'score_desc', 'score_asc']).default('date_desc'),
  limit: z.number().int().min(1).max(200).default(50),
})
export type AnalysisListQuery = z.infer<typeof AnalysisListQuery>
