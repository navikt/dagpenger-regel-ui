import { join } from "path";

const rootUri = "/v1/inntekt";

export const uklassifisert = (aktørId, vedtakId, beregningsDato) =>
  join(
    process.env.APP_INNTEKT_BASEURL,
    rootUri,
    "uklassifisert",
    aktørId,
    "vedtak",
    vedtakId,
    beregningsDato
  );

export const uncached = (aktørId, vedtakId, beregningsDato) =>
  join(
    process.env.APP_INNTEKT_BASEURL,
    rootUri,
    "uklassifisert/uncached",
    aktørId,
    "vedtak",
    vedtakId,
    beregningsDato
  );

export const verdikoder = () =>
  join(process.env.APP_INNTEKT_BASEURL, rootUri, "verdikoder");
