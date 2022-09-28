import { join } from "path";

const rootUri = "/v1/inntekt";

const uklassifisert = (aktørId, vedtakId, beregningsDato) =>
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

export async function postUklassifisert(
  aktorId,
  vedtakId,
  beregningsDato,
  apiToken,
  body
) {
  const data = await fetch(uklassifisert(aktorId, vedtakId, beregningsDato), {
    method: "POST",
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${apiToken}`,
      "Content-type": "application/json",
    },
    body,
  });

  return data.json();
}

export async function getUklassifisert(
  aktorId,
  vedtakId,
  beregningsDato,
  apiToken
) {
  const res = await fetch(uklassifisert(aktorId, vedtakId, beregningsDato), {
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${apiToken}`,
    },
  });

  return res.json();
}

export default {
  getUklassifisert,
  postUklassifisert,
};
