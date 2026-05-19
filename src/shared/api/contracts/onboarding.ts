import { z } from 'zod'

export const OnboardingStep = z.enum([
  'PROFILE_BASICS',
  'VOICE_SAMPLE',
  'GOALS',
  'CONSENT',
  'COMPLETE',
])
export type OnboardingStep = z.infer<typeof OnboardingStep>

export const CompletedStepRecord = z.object({
  step: OnboardingStep,
  completedAt: z.string(),
})
export type CompletedStepRecord = z.infer<typeof CompletedStepRecord>

export const OnboardingState = z.object({
  currentStep: OnboardingStep,
  completedSteps: z.array(CompletedStepRecord),
  isComplete: z.boolean(),
})
export type OnboardingState = z.infer<typeof OnboardingState>
