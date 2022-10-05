import { uncached } from "../../../lib/api/inntekt";
import { getSession } from "@navikt/dp-auth/session";
import { azureAd } from "@navikt/dp-auth";

const provider = azureAd;

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

  const data = await fetch(uncached(aktorId, vedtakId, beregningsDato), {
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${apiToken}`,
    },
  });

  res.json(await data.json());
}

async function handlePost(req, res) {
  const session = await getSession(provider, { req });
  console.log(`Forsøker å oppdatere inntekt`);
  if (!session) return res.status(401).end();

  const { aktorId, vedtakId, beregningsDato } = req.query;
  const apiToken = await session.apiToken(process.env.INNTEKT_API_AUDIENCE);

  try {
    let body = req.body;
    console.log(`request body: ${JSON.stringify(body)}`);
    const data = await fetch(uncached(aktorId, vedtakId, beregningsDato), {
      method: "POST",
      headers: {
        Accept: `application/json`,
        Authorization: `Bearer ${apiToken}`,
        "Content-type": "application/json",
      },
      body: body,
    });

    res.json(await data.json());
  } catch (e) {
    console.log(
      `Klarte ikke å håndtere POST mot uklassifisert inntekt. Feilmelding: ${e.message}`
    );
    res.status(500).send("Klarte ikke å oppdatere inntekt");
  }
}
