import { getInntekt, getVerdikoder, lagreInntekt } from "../inntektApiClient";
import verdikoder from "../../mocks/fixtures/verdikoder.json";
import { rest } from "msw";
import { server } from "../../mocks/server";

const baseURL = "http://localhost";

const apiUri = "/api/v1/inntekt";
const apiUklassifisertUri = `${apiUri}/uklassifisert`;
const apiUncachedUri = `${apiUklassifisertUri}/uncached`;

const params = {
  aktørId: "111",
  kontekst: "vedtak",
  vedtakId: 12345,
  beregningsDato: "2019-05-01",
};

const isUncached = true;

describe("InntektApiClient", () => {
  it("Should handle 200 response", async () => {
    const expectedReturn = "data";

    const data = await getInntekt(params);
    expect(data.inntekt.arbeidsInntektMaaned).toHaveLength(6);
    expect(data).toMatchSnapshot();
  });

  it("Should handle 500 response", async () => {
    server.use(
      rest.get("/api/inntekt", (req, res, ctx) => res(ctx.status(500)))
    );

    await expect(getInntekt(params)).rejects.toThrow("Internal Server Error");
  });

  it("Should save inntekt with 200", async () => {
    const data = { field: "123" };
    const result = await lagreInntekt(data, isUncached, params);
    expect(result).toEqual({ success: true });
  });

  it("Should fail to save inntekt", async () => {
    const data = { field: "123" };
    server.use(
      rest.post("/api/inntekt/uncached", (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    await expect(lagreInntekt(data, isUncached, params)).rejects.toThrow(
      "Internal Server Error"
    );
  });

  it("Skal hente verdikoder", async () => {
    const result = await getVerdikoder();
    expect(result).toEqual(verdikoder);
  });
});
