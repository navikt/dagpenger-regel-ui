import { getUklassifisert, postUklassifisert } from "../../api/inntekt";
import { server } from "../../../mocks/server";
import { rest } from "msw";

describe("Inntekt API", () => {
  it("POST /uklassifisert", async () => {
    server.use(
      rest.post(
        "http://dp-inntekt-api.test/v1/inntekt/uklassifisert/123/vedtak/123/2020-01-01",
        (req, res, ctx) => {
          if (req.headers.get("content-type") != "application/json")
            return res(ctx.status(500));
          return res(
            ctx.json({
              inntekt: { arbeidsInntektMaaned: [1, 2, 3, 4, 5, 6] },
            })
          );
        }
      )
    );
    const data = await postUklassifisert(
      "123",
      "123",
      "2020-01-01",
      "123",
      "{}"
    );

    expect(data.inntekt.arbeidsInntektMaaned).toHaveLength(6);
    expect(data).toMatchSnapshot();
  });
});
