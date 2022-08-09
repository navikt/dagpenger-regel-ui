import { uncached } from "../../../lib/api/inntekt";

export default async function handler(req, res) {
  const { aktorId, vedtakId, beregningsDato } = req.query;
  const data = await fetch(uncached(aktorId, vedtakId, beregningsDato));

  res.json(await data.json());
}
