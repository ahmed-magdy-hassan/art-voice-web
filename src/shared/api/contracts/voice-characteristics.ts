import { z } from 'zod'

export const VoiceCharacteristics = z.object({
  analysisId: z.string(),
  clarity: z.number().min(0).max(100),
  pace: z.number().min(0).max(100),
  tone: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  energy: z.number().min(0).max(100),
  empathy: z.number().min(0).max(100),
  computedAt: z.string(),
})
export type VoiceCharacteristics = z.infer<typeof VoiceCharacteristics>

export const RADAR_AXES: (keyof Omit<VoiceCharacteristics, 'analysisId' | 'computedAt'>)[] = [
  'clarity', 'pace', 'tone', 'confidence', 'energy', 'empathy',
]
