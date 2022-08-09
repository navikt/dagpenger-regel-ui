export default async function (req, res) {
  const { orgNr } = req.query;

  const data = await fetch(
    `${process.env.APP_INNTEKT_BASEURL}/v1/enhetsregisteret/enhet/${orgNr}`
  );

  res.json(await data.json());
}