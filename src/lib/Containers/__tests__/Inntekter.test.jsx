import React from "react";
import renderer from "react-test-renderer";
import Inntekter, { findArbeidsgivere } from "../Inntekter";
import inntektJson from "../../../mocks/fixtures/inntekt-uklassifisert.json";

describe("Inntekter", () => {
  test("Skal vise Dashboard med loader", () => {
    const component = renderer.create(
      <Inntekter
        visFor={{
          aktørId: "3_G_INNTEKT",
          vedtakId: "12345",
          beregningsDato: "2019-07-01",
        }}
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Mapper arbeidsgivere", async () => {
    const arbeidsgivere = await findArbeidsgivere(inntektJson.inntekt);
    expect(arbeidsgivere).toMatchSnapshot();
  });
});
