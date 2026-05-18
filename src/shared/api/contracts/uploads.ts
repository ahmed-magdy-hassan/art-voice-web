import { z } from 'zod'

export const UploadPart = z.object({
  partNumber: z.number().int().min(1).max(10_000),
  url: z.string().url(),
  size: z.number().int().positive(),
})
export type UploadPart = z.infer<typeof UploadPart>

export const InitUploadRequest = z.object({
  filename: z.string().min(1).max(260),
  contentType: z.string().min(1).max(120),
  fileSize: z.number().int().positive(),
})
export type InitUploadRequest = z.infer<typeof InitUploadRequest>

export const InitUploadResponse = z.object({
  uploadId: z.string(),
  audioId: z.string(),
  parts: z.array(UploadPart).min(1),
  partSize: z.number().int().positive(),
})
export type InitUploadResponse = z.infer<typeof InitUploadResponse>

export const CompleteUploadRequest = z.object({
  uploadId: z.string(),
  audioId: z.string(),
  parts: z
    .array(z.object({ partNumber: z.number().int().min(1), etag: z.string().min(1) }))
    .min(1),
})
export type CompleteUploadRequest = z.infer<typeof CompleteUploadRequest>

export const CompleteUploadResponse = z.object({
  audioId: z.string(),
  status: z.literal('queued'),
})
export type CompleteUploadResponse = z.infer<typeof CompleteUploadResponse>
