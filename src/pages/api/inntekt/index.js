import inntekt from "../../../lib/api/inntekt";
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

  const data = await inntekt.getUklassifisert(
    aktorId,
    vedtakId,
    beregningsDato,
    apiToken
  );

  res.json(data);
}

async function handlePost(req, res) {
  const session = await getSession(provider, { req });
  if (!session) return res.status(401).end();

  const { aktorId, vedtakId, beregningsDato } = req.query;
  const apiToken = await session.apiToken(process.env.INNTEKT_API_AUDIENCE);

  try {
    let response = await inntekt.postUklassifisert(
      aktorId,
      vedtakId,
      beregningsDato,
      apiToken,
      req.body
    );
    res.json(response);
  } catch (err) {
    console.log(
      `Klarte ikke å håndtere POST mot uklassifisert inntekt. Feilmelding: ${err.message}`
    );
    res.status(500).send("Klarte ikke å oppdatere inntekt");
  }
}
