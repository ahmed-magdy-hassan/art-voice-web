import { z } from 'zod';

const RequestSchema = z.object({
  userName: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, RequestSchema.parse);

  // x-user-id / x-tenant-id are set by the BFF session middleware after
  // reading the httpOnly access-token cookie (set post-sign-in).
  // For now we forward them from the incoming request headers (gateway stamps them).
  const userId = getRequestHeader(event, 'x-user-id') ?? '';
  const tenantId = getRequestHeader(event, 'x-tenant-id') ?? '';

  const config = useRuntimeConfig();
  return await $fetch(`${config.businessUrl}/v1/auth/webauthn/register/options`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-user-id': userId,
      'x-tenant-id': tenantId,
    },
    body: { userName: body.userName },
  });
});
