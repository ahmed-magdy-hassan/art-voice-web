import type { OnboardingStep } from '@/shared/api/contracts/onboarding'

export interface StepConfig {
  key: OnboardingStep
  label: string
  title: string
  description: string
  cta: string
}

export const STEPS: StepConfig[] = [
  {
    key: 'PROFILE_BASICS',
    label: 'Profile',
    title: 'Tell us about yourself',
    description: 'Set your name, role, and the language you coach in so we can personalise your experience.',
    cta: 'Save & continue',
  },
  {
    key: 'VOICE_SAMPLE',
    label: 'Voice sample',
    title: 'Record your baseline',
    description: 'Read the prompt below aloud so our AI can build your voice fingerprint. 30–60 seconds is ideal.',
    cta: 'Use this recording',
  },
  {
    key: 'GOALS',
    label: 'Goals',
    title: 'What do you want to improve?',
    description: "Pick the areas that matter most to you. We'll weight your coaching plan accordingly.",
    cta: 'Set goals',
  },
  {
    key: 'CONSENT',
    label: 'Consent',
    title: 'Data & privacy',
    description: 'Your recordings are processed to generate feedback. Review and confirm how we use your data.',
    cta: "I agree, let's go",
  },
  {
    key: 'COMPLETE',
    label: 'Done',
    title: "You're all set!",
    description: 'Your voice profile is ready. Head to your dashboard to see your first insights.',
    cta: 'Go to dashboard',
  },
]

export const ORDERED_STEPS = STEPS.map((s) => s.key)
