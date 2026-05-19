import { z } from 'zod'

export const ExerciseCategory = z.enum([
  'pace',
  'filler_reduction',
  'articulation',
  'emotion_range',
  'volume',
  'breathing',
  'confidence',
])
export type ExerciseCategory = z.infer<typeof ExerciseCategory>

export const Exercise = z.object({
  exercise_id: z.string(),
  title: z.string(),
  description: z.string(),
  category: ExerciseCategory,
  difficulty: z.number().int().min(1).max(5),
  duration_minutes: z.number().int(),
  prerequisites: z.array(z.string()),
})
export type Exercise = z.infer<typeof Exercise>

export const RecommendedExercise = z.object({
  exercise: Exercise,
  score: z.number(),
  rationale: z.string(),
  action_label: z.string(),
})
export type RecommendedExercise = z.infer<typeof RecommendedExercise>

export const RecoResponse = z.object({
  user_id: z.string(),
  recommendations: z.array(RecommendedExercise),
})
export type RecoResponse = z.infer<typeof RecoResponse>
