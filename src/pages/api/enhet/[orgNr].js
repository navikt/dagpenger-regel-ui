export default async function enhet(req, res) {
  const { orgNr } = req.query;

  const data = await fetch(
    `${process.env.INNTEKT_API}/v1/enhetsregisteret/enhet/${orgNr}`
  );

  res.json(await data.json());
}
