import { isValidFodselsnummer } from "../validering";

const validFodselsnummer = "07078518434";

describe("Fødselsnummer-utils", () => {
  test("skal godkjenne gyldig fødselsnummer", () => {
    expect(isValidFodselsnummer(validFodselsnummer)).toBe(true);
  });

  test("skal underkjenne ugyldig fødselsnummer", () => {
    let invalidFodselsnummer = "31048518434";
    expect(isValidFodselsnummer(invalidFodselsnummer)).toBe(false);
    invalidFodselsnummer = "9999999999";
    expect(isValidFodselsnummer(invalidFodselsnummer)).toBe(false);
    invalidFodselsnummer = `${validFodselsnummer}1`;
    expect(isValidFodselsnummer(invalidFodselsnummer)).toBe(false);
  });
});
