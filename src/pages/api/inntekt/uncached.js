import { uncached } from "../../../lib/api/inntekt";
import { getAzureSession, getInntektOboToken } from "../../../lib/Utils/auth";

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
  const session = await getAzureSession(request);
  if (!session) return res.status(401).end();
  const apiToken = await getInntektOboToken(session);

  const { aktorId, vedtakId, beregningsDato } = req.query;

  const data = await fetch(uncached(aktorId, vedtakId, beregningsDato), {
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${apiToken}`,
    },
  });

  res.json(await data.json());
}

async function handlePost(req, res) {
  console.log(`Forsøker å oppdatere inntekt`);
  const session = await getAzureSession(request);
  if (!session) return res.status(401).end();
  const apiToken = await getInntektOboToken(session);

  const { aktorId, vedtakId, beregningsDato } = req.query;

  try {
    const data = await fetch(uncached(aktorId, vedtakId, beregningsDato), {
      method: "POST",
      headers: {
        Accept: `application/json`,
        Authorization: `Bearer ${apiToken}`,
        "Content-type": "application/json",
      },
      body: req.body,
    });

    const jsonData = await data.json();
    console.log(`Oppdatert inntekt OK`);
    res.json(jsonData);
  } catch (e) {
    console.log(
      `Klarte ikke å håndtere POST mot uklassifisert inntekt. Feilmelding: ${e.message}`
    );
    res.status(500).send("Klarte ikke å oppdatere inntekt");
  }
}
