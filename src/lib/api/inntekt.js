import { join } from "path";

const rootUri = "/v1/inntekt";

export const uklassifisert = (aktørId, vedtakId, beregningsDato) =>
  join(
    process.env.INNTEKT_API,
    rootUri,
    "uklassifisert",
    aktørId,
    "vedtak",
    vedtakId,
    beregningsDato
  );

export const uncached = (aktørId, vedtakId, beregningsDato) =>
  join(
    process.env.INNTEKT_API,
    rootUri,
    "uklassifisert/uncached",
    aktørId,
    "vedtak",
    vedtakId,
    beregningsDato
  );

export const verdikoder = () =>
  join(process.env.INNTEKT_API, rootUri, "verdikoder");
