import { uklassifisert, uncached } from "../../../lib/api/inntekt";

export default async function handler(req, res) {
  console.log(req.method);
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
  const { aktorId, vedtakId, beregningsDato } = req.query;
  const data = await fetch(uncached(aktorId, vedtakId, beregningsDato));

  res.json(await data.json());
}

async function handlePost(req, res) {
  const { aktorId, vedtakId, beregningsDato } = req.query;
  const body = req.body;
  console.log(body);
  const data = await fetch(uncached(aktorId, vedtakId, beregningsDato), {
    method: "POST",
    body: JSON.stringify(body),
  });

  res.json(await data.json());
}
