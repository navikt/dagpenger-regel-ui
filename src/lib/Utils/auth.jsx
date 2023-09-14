import { makeSession } from "@navikt/dp-auth";
import { azure } from "@navikt/dp-auth/identity-providers";
import { azure as azureOBO } from "@navikt/dp-auth/obo-providers";

export let getAzureSession;
getAzureSession = makeSession({
  identityProvider: azure,
  oboProvider: azureOBO,
});

export async function getInntektOboToken(session) {
  const oboToken = await session.apiToken(process.env.INNTEKT_API_AUDIENCE);
  return oboToken;
}
