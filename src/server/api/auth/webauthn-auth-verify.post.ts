import { z } from 'zod';
import { setCookie } from 'h3';
import { SignInTokenResponse } from '~/shared/api/contracts/auth';

const RequestSchema = z.object({
  challenge: z.string().min(1),
  response: z.unknown(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, RequestSchema.parse);
  const config = useRuntimeConfig();

  const result = await $fetch<Record<string, unknown>>(
    `${config.businessUrl}/v1/auth/webauthn/authenticate/verify`,
    {
      method: 'POST',
      body: { challenge: body.challenge, response: body.response },
    },
  );

  // Lift refreshToken into httpOnly cookie — same pattern as sign-in.
  if (result.refreshToken && result.refreshTokenExpiresAt) {
    const expires = new Date(result.refreshTokenExpiresAt as string);
    setCookie(event, '__Host-art_refresh', result.refreshToken as string, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/v1/auth',
      expires,
    });
    const { refreshToken: _rt, refreshTokenExpiresAt: _rta, ...safe } = result;
    return safe;
  }

  return result;
});
