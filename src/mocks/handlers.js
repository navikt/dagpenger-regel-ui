import { rest } from "msw";
import verdikoder from "./fixtures/verdikoder.json";
import inntektUklassifisert from "./fixtures/inntekt-uklassifisert.json";
import enhetsregisteret from "./fixtures/enhetsregisteret.json";

export const handlers = [
  rest.get("/api/inntekt/verdikoder", (req, res, ctx) =>
    res(ctx.json(verdikoder))
  ),
  rest.get("/api/inntekt", (req, res, ctx) =>
    res(ctx.json(inntektUklassifisert))
  ),
  rest.post("/api/inntekt", (req, res, ctx) =>
    res(ctx.json({ success: true }))
  ),
  rest.get("/api/enhet/:enhetId", (req, res, ctx) =>
    res(ctx.json(enhetsregisteret))
  ),
];
