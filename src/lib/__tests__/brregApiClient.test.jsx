import { getOrganisasjonsNavn } from "../brregApiClient";

describe("BrregApiClient", () => {
  it("Should handle 200 response on org name lookup", async () => {
    const organisasjonsnummer = "123456789";
    const expectedReturn = { organisasjonsnummer, navn: "Sopra Steria" };

    const result = await getOrganisasjonsNavn(organisasjonsnummer);
    expect(result).toEqual(expectedReturn);
  });
});
