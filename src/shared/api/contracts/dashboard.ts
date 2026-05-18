import { z } from 'zod'

export const SparklinePoint = z.object({
  t: z.string(), // ISO date
  v: z.number(),
})
export type SparklinePoint = z.infer<typeof SparklinePoint>

export const DashboardCard = z.object({
  key: z.enum(['score', 'analyses', 'streak', 'listening']),
  label: z.string(),
  value: z.number(),
  unit: z.string().optional(),
  trend: z.array(SparklinePoint).max(60),
  deltaPercent: z.number().optional(),
})
export type DashboardCard = z.infer<typeof DashboardCard>

export const DashboardSummary = z.object({
  isNewUser: z.boolean(),
  cards: z.array(DashboardCard).length(4),
  generatedAt: z.string(),
})
export type DashboardSummary = z.infer<typeof DashboardSummary>
