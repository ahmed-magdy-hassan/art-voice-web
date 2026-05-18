import { OpenFeature, InMemoryProvider, type Client } from '@openfeature/web-sdk'

// Default flag set used until an env-specific provider is wired (LaunchDarkly, Flagd, …).
// Adding a new flag here documents its existence; the live value comes from the provider.
const DEFAULT_FLAGS = {
  'audio-upload-v2': { variants: { on: true, off: false }, defaultVariant: 'off', disabled: false },
  'show-coach-banner': { variants: { on: true, off: false }, defaultVariant: 'off', disabled: false },
} as const

let cachedClient: Client | null = null

export async function initFeatureFlags(): Promise<Client> {
  if (cachedClient) return cachedClient
  const provider = new InMemoryProvider(DEFAULT_FLAGS)
  await OpenFeature.setProviderAndWait(provider)
  cachedClient = OpenFeature.getClient('art-voice-web')
  return cachedClient
}

export function getFlagClient(): Client {
  if (!cachedClient) {
    throw new Error('Feature-flag client used before initFeatureFlags() resolved.')
  }
  return cachedClient
}
