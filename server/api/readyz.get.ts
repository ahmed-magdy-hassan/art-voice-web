export default defineEventHandler(async () => {
  const cfg = useRuntimeConfig()
  const upstream = cfg.gatewayInternalUrl
  if (!upstream) return { status: 'ok', upstream: 'not-configured' }

  try {
    const res = await $fetch<{ status: string }>(`${upstream}/healthz`, { timeout: 1500 })
    return { status: 'ok', upstream: res?.status ?? 'unknown' }
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'gateway unreachable' })
  }
})
