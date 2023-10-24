import { makeSession } from "@navikt/dp-auth";
import { azure } from "@navikt/dp-auth/identity-providers";
import {
  azure as azureOBO,
  withInMemoryCache,
} from "@navikt/dp-auth/obo-providers";
import { withPrometheus } from "@navikt/dp-auth/obo-providers/withPrometheus";

export let getAzureSession;
getAzureSession = makeSession({
  identityProvider: azure,
  oboProvider: withInMemoryCache(withPrometheus(azureOBO)),
});

export async function getInntektOboToken(session) {
  const oboToken = await session.apiToken(process.env.INNTEKT_API_AUDIENCE);
  return oboToken;
}
