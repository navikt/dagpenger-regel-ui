import React from "react";
import renderer from "react-test-renderer";
import { Undertekst } from "nav-frontend-typografi";
import Arbeidsgiver from "../Arbeidsgiver";

const arbeidsgiver = {
  identifikator: "111111111",
  aktoerType: "ORGANISASJON",
};

describe("Arbeidsgiver", () => {
  test("Skal vise arbeidsgiver", () => {
    const component = renderer.create(
      <Arbeidsgiver arbeidsgiver={arbeidsgiver} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Skal vise Org. nr da dette er en organisasjon", () => {
    const component = renderer.create(
      <Arbeidsgiver arbeidsgiver={arbeidsgiver} />
    );
    expect(component.root.findByType(Undertekst).props.children).toEqual(
      "Org. nr"
    );
  });
});
