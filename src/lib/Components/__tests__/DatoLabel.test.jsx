import React from "react";
import renderer from "react-test-renderer";
import DatoLabel from "../DatoLabel";
import { MMMM_YYYY_FORMAT } from "../../Utils/datoFormat";

describe("DatoLavel", () => {
  test("Dato label with MMMM_YYYY_FORMAT", () => {
    const component = renderer.create(
      <DatoLabel dato="2019-05" datoFormat={MMMM_YYYY_FORMAT} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Skal vise 2019-05 som mai 2019", () => {
    const component = renderer.create(
      <DatoLabel dato="2019-05" datoFormat={MMMM_YYYY_FORMAT} />
    );
    expect(component.root.children).toEqual(["mai 2019"]);
  });
});
