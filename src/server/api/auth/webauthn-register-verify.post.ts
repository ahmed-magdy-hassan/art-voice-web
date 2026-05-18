import { z } from 'zod';

const RequestSchema = z.object({
  challenge: z.string().min(1),
  response: z.unknown(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, RequestSchema.parse);

  const userId = getRequestHeader(event, 'x-user-id') ?? '';
  const tenantId = getRequestHeader(event, 'x-tenant-id') ?? '';

  const config = useRuntimeConfig();
  return await $fetch(`${config.businessUrl}/v1/auth/webauthn/register/verify`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-user-id': userId,
      'x-tenant-id': tenantId,
    },
    body: { challenge: body.challenge, response: body.response },
  });
});
