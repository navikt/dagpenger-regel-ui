import { verdikoder } from "../../../lib/api/inntekt";

export default async function handler(req, res) {
  const data = await fetch(verdikoder());

  res.json(await data.json());
}
