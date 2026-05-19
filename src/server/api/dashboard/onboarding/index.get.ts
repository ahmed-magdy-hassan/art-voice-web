// KAN-270 — Fetch current onboarding state.
import { OnboardingState } from '@/shared/api/contracts/onboarding'
import { businessFetch, contextHeaders } from '../../../utils/upstream'

export default defineEventHandler(async (event) => {
  try {
    return await businessFetch<unknown>('/v1/dashboard/onboarding', {
      headers: contextHeaders(event),
      schema: OnboardingState,
    })
  } catch {
    return OnboardingState.parse({
      currentStep: 'PROFILE_BASICS',
      completedSteps: [],
      isComplete: false,
    })
  }
})
