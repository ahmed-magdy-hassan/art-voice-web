import { useMutation } from '@tanstack/vue-query';

export function useWebAuthnAuthenticate() {
  return useMutation({
    mutationFn: async (credentialId?: string) => {
      // 1. Get challenge options from BFF
      const optionsResult = await $fetch<{
        credentialRequestOptions: PublicKeyCredentialRequestOptions;
        challenge: string;
      }>('/api/auth/webauthn-auth-options', {
        method: 'POST',
        body: { credentialId },
      });

      // 2. Call browser WebAuthn API
      const assertion = await navigator.credentials.get({
        publicKey: optionsResult.credentialRequestOptions,
      }) as PublicKeyCredential | null;

      if (!assertion) throw new Error('WebAuthn authentication was cancelled');

      const response = assertion.response as AuthenticatorAssertionResponse;

      // 3. Verify with BFF (which lifts refresh token into cookie)
      return await $fetch('/api/auth/webauthn-auth-verify', {
        method: 'POST',
        body: {
          challenge: optionsResult.challenge,
          response: {
            id: assertion.id,
            rawId: btoa(String.fromCharCode(...new Uint8Array(assertion.rawId))),
            type: assertion.type,
            response: {
              clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(response.clientDataJSON))),
              authenticatorData: btoa(String.fromCharCode(...new Uint8Array(response.authenticatorData))),
              signature: btoa(String.fromCharCode(...new Uint8Array(response.signature))),
              userHandle: response.userHandle
                ? btoa(String.fromCharCode(...new Uint8Array(response.userHandle)))
                : null,
            },
          },
        },
      });
    },
  });
}
