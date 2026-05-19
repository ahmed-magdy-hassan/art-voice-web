import { z } from 'zod'

export const CoachingStep = z.object({
  order: z.number().int(),
  title: z.string(),
  description: z.string(),
  exercise: z.string(),
  duration_minutes: z.number().int(),
  focus_metric: z.string(),
})
export type CoachingStep = z.infer<typeof CoachingStep>

export const CoachingPlan = z.object({
  user_id: z.string(),
  summary: z.string(),
  strengths: z.array(z.string()),
  improvement_areas: z.array(z.string()),
  steps: z.array(CoachingStep),
  cache_hit: z.boolean(),
})
export type CoachingPlan = z.infer<typeof CoachingPlan>

export const ChatMessage = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})
export type ChatMessage = z.infer<typeof ChatMessage>

export const ChatResponse = z.object({
  thread_id: z.string(),
  reply: z.string(),
  safety_flagged: z.boolean(),
  cache_hit: z.boolean(),
})
export type ChatResponse = z.infer<typeof ChatResponse>
