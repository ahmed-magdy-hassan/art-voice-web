import { z } from 'zod'

export const VoiceSampleStatus = z.enum(['PENDING', 'PROCESSING', 'READY', 'FAILED'])
export type VoiceSampleStatus = z.infer<typeof VoiceSampleStatus>

export const VoiceSample = z.object({
  id: z.string(),
  label: z.string().optional(),
  durationSeconds: z.number().optional(),
  status: VoiceSampleStatus,
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type VoiceSample = z.infer<typeof VoiceSample>

export const VoiceSamplesResponse = z.object({
  items: z.array(VoiceSample),
})
export type VoiceSamplesResponse = z.infer<typeof VoiceSamplesResponse>

export const CreateSampleResponse = z.object({
  sample: z.object({ id: z.string() }).passthrough(),
  uploadUrl: z.string(),
  uploadExpiresAt: z.string(),
})
export type CreateSampleResponse = z.infer<typeof CreateSampleResponse>

export const VoiceProfile = z.object({
  userId: z.string().optional(),
  displayName: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  accent: z.string().nullable().optional(),
  goals: z.array(z.string()).default([]),
  completenessScore: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})
export type VoiceProfile = z.infer<typeof VoiceProfile>

export const ProfileCompleteness = z.object({
  score: z.number().min(0).max(100),
  breakdown: z.record(z.string(), z.boolean()).optional(),
})
export type ProfileCompleteness = z.infer<typeof ProfileCompleteness>
