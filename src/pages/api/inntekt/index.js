import { uklassifisert } from "../../../lib/api/inntekt";
import { getSession } from "@navikt/dp-auth/session";
import { provider } from "../../../middleware";
import { audience } from "../../../lib/api/fetcher";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      await handleGet(req, res);
      break;
    case "POST":
      await handlePost(req, res);
      break;
  }

  res.status(405).text("Method Not Allowed");
}

async function handleGet(req, res) {
  const session = await getSession(provider, { req });
  if (!session) return res.status(401).end();

  const { aktorId, vedtakId, beregningsDato } = req.query;
  const apiToken = await session.apiToken(audience("dp-inntekt-api"));

  const data = await fetch(uklassifisert(aktorId, vedtakId, beregningsDato), {
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${apiToken}`,
    },
  });

  res.json(await data.json());
}

async function handlePost(req, res) {
  const session = await getSession(provider, { req });
  if (!session) return res.status(401).end();

  const { aktorId, vedtakId, beregningsDato } = req.query;
  const apiToken = await session.apiToken(audience("dp-inntekt-api"));

  const data = await fetch(uklassifisert(aktorId, vedtakId, beregningsDato), {
    method: "POST",
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(req.body),
  });

  res.json(await data.json());
}
