import createAuthMiddleware, { azureAd } from "@navikt/dp-auth";

export const provider = azureAd;

const _middleware = createAuthMiddleware({
  enforceAuth: process.env.NODE_ENV !== "development",
  provider,
});

export default _middleware;
