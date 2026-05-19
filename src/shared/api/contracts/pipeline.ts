import { z } from 'zod'

export const PipelineEventStatus = z.enum([
  'PENDING', 'RUNNING', 'DONE', 'FAILED', 'SKIPPED',
])
export type PipelineEventStatus = z.infer<typeof PipelineEventStatus>

export const PipelineEvent = z.object({
  step: z.string(),
  status: PipelineEventStatus,
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  errorMessage: z.string().nullable(),
})
export type PipelineEvent = z.infer<typeof PipelineEvent>

export const PipelineStatus = z.object({
  analysisId: z.string(),
  overallStatus: z.enum(['PENDING', 'RUNNING', 'DONE', 'FAILED']),
  events: z.array(PipelineEvent),
})
export type PipelineStatus = z.infer<typeof PipelineStatus>
