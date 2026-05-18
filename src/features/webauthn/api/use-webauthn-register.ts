import { useMutation } from '@tanstack/vue-query';

export function useWebAuthnRegister() {
  return useMutation({
    mutationFn: async (userName: string) => {
      // 1. Get options from BFF
      const optionsResult = await $fetch<{
        credentialCreationOptions: PublicKeyCredentialCreationOptions;
        challenge: string;
      }>('/api/auth/webauthn-register-options', {
        method: 'POST',
        body: { userName },
      });

      // 2. Call browser WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: optionsResult.credentialCreationOptions,
      }) as PublicKeyCredential | null;

      if (!credential) throw new Error('WebAuthn registration was cancelled');

      const response = credential.response as AuthenticatorAttestationResponse;

      // 3. Serialize and verify with server
      return await $fetch('/api/auth/webauthn-register-verify', {
        method: 'POST',
        body: {
          challenge: optionsResult.challenge,
          response: {
            id: credential.id,
            rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
            type: credential.type,
            response: {
              clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(response.clientDataJSON))),
              attestationObject: btoa(String.fromCharCode(...new Uint8Array(response.attestationObject))),
              transports: response.getTransports?.() ?? [],
            },
          },
        },
      });
    },
  });
}
