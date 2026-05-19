// KAN-270 — Advance onboarding to next step.
import { OnboardingState, OnboardingStep } from '@/shared/api/contracts/onboarding'
import { businessFetch, contextHeaders } from '../../../utils/upstream'
import { readBody } from 'h3'
import { z } from 'zod'

const Body = z.object({ completedStep: OnboardingStep })

export default defineEventHandler(async (event) => {
  const body = Body.parse(await readBody(event))
  return await businessFetch<unknown>('/v1/dashboard/onboarding/advance', {
    method: 'POST',
    body,
    headers: contextHeaders(event),
    schema: OnboardingState,
  })
})
