import { z } from 'zod';

const RequestSchema = z.object({
  credentialId: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, RequestSchema.parse);
  const config = useRuntimeConfig();
  return await $fetch(`${config.businessUrl}/v1/auth/webauthn/authenticate/options`, {
    method: 'POST',
    body: { credentialId: body.credentialId },
  });
});
