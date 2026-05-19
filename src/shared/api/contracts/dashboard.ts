import { z } from 'zod'

export const Notification = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  body: z.string().optional(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
})
export type Notification = z.infer<typeof Notification>

export const NotificationsResponse = z.object({
  items: z.array(Notification),
  unreadCount: z.number(),
  nextCursor: z.string().nullable(),
})
export type NotificationsResponse = z.infer<typeof NotificationsResponse>

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
