import { z } from 'zod'

export const Annotation = z.object({
  // Seconds from the start of the audio.
  tStart: z.number().nonnegative(),
  tEnd: z.number().nonnegative(),
  kind: z.enum(['emotion', 'metric', 'turn']),
  label: z.string(),
  score: z.number().optional(),
})
export type Annotation = z.infer<typeof Annotation>

export const EmotionFrame = z.object({
  t: z.number().nonnegative(),
  label: z.string(),
  score: z.number().min(0).max(1),
})

export const SpeechMetric = z.object({
  key: z.string(),
  label: z.string(),
  value: z.number(),
  unit: z.string().optional(),
})

export const DiarizationTurn = z.object({
  tStart: z.number().nonnegative(),
  tEnd: z.number().nonnegative(),
  speaker: z.string(),
})

export const AnalysisDetail = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
  durationSeconds: z.number().nonnegative(),
  signedAudioUrl: z.string().url(),
  signedAudioExpiresAt: z.string(),
  transcript: z
    .array(z.object({ tStart: z.number(), tEnd: z.number(), speaker: z.string(), text: z.string() }))
    .default([]),
  emotionTimeline: z.array(EmotionFrame).default([]),
  speechMetrics: z.array(SpeechMetric).default([]),
  diarization: z.array(DiarizationTurn).default([]),
  annotations: z.array(Annotation).default([]),
})
export type AnalysisDetail = z.infer<typeof AnalysisDetail>
