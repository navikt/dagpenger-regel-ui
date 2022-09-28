import { formatertPengesum, formatertPengesum2 } from "../currencyUtils";

describe("Currency-utils", () => {
  xtest("skal teste at beloep er korrekt formatert med krone-notasjon metode 1", () => {
    expect(formatertPengesum("120000")).toEqual("NOK 120 000.00");
  });

  test("skal teste at beloep er korrekt formatert med krone-notasjon metode 2", () => {
    expect(formatertPengesum2("120000")).toEqual("120 000 kr");
  });
});
