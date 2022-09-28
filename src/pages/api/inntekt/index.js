import { uklassifisert } from "../../../lib/api/inntekt";
import { getSession } from "@navikt/dp-auth/session";
import { provider } from "../../../middleware";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      await handleGet(req, res);
      break;
    case "POST":
      await handlePost(req, res);
      break;
    default:
      res.status(405).text("Method Not Allowed");
      break;
  }
}

async function handleGet(req, res) {
  const session = await getSession(provider, { req });
  if (!session) return res.status(401).end();

  const { aktorId, vedtakId, beregningsDato } = req.query;
  const apiToken = await session.apiToken(process.env.INNTEKT_API_AUDIENCE);
  console.log(
    `Doing request for${process.env.INNTEKT_API_AUDIENCE}. Token length: ${apiToken.length}`
  );
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
  const apiToken = await session.apiToken(process.env.INNTEKT_API_AUDIENCE);

  const data = await fetch(uklassifisert(aktorId, vedtakId, beregningsDato), {
    method: "POST",
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${apiToken}`,
      "Content-type": "application/json",
    },
    body: req.body,
  });

  res.json(await data.json());
}
