import { z } from 'zod'

// Gateway POST /v1/auth/token-exchange response (KAN-285).
export const ExchangedToken = z.object({
  accessToken: z.string(),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number(),
  scope: z.string(),
})
export type ExchangedToken = z.infer<typeof ExchangedToken>

// BFF POST /api/realtime/sessions response. `sfu` is null until the
// mediasoup WebRTC SFU lands (KAN-100); the client then takes the WSS Opus
// path (UC-19.25 alt-flow 1a), which is what this slice ships.
export const LiveSessionResponse = z.object({
  sessionId: z.string(),
  wsUrl: z.string(),
  realtimeToken: z.string(),
  expiresIn: z.number(),
  sfu: z.null(),
})
export type LiveSessionResponse = z.infer<typeof LiveSessionResponse>

// Inference frame relayed back over the WS by svc-realtime (mirrors the
// RealtimeInference proto's InferenceFrame, JSON-encoded).
export const InferenceFrame = z.object({
  sessionId: z.string(),
  seq: z.number(),
  partialTranscript: z.string(),
  speakerId: z.string(),
  isFinal: z.boolean(),
  emotion: z
    .object({
      label: z.string(),
      valence: z.number(),
      arousal: z.number(),
      dominance: z.number(),
      confidence: z.number(),
    })
    .optional(),
})
export type InferenceFrame = z.infer<typeof InferenceFrame>
