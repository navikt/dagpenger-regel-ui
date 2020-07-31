import nock from 'nock';
import { getOrganisasjonsNavn } from '../brregApiClient';

const baseURL = 'http://localhost';


const apiUri = '/brreg/api';


describe('OppslagApiClient', () => {
  it('Should handle 200 response on org name lookup', async () => {
    const orgNr = 12345678;
    const expectedReturn = { organisasjonsnummer: '12345678', navn: 'Et navn' };
    nock(baseURL)
      .get(`${apiUri}/enheter/${orgNr}`)
      .reply(200, expectedReturn);

    try {
      const result = await getOrganisasjonsNavn(orgNr);
      expect(result.data).toEqual(expectedReturn);
    } catch (error) {
      throw error;
    }
  });

  it('Should fetch possible underenhet', async () => {
    const orgNr = 12345678;
    const expectedReturn = { organisasjonsnummer: '12345678', navn: 'Et navn' };
    nock(baseURL)
      .get(`${apiUri}/enheter/${orgNr}`)
      .reply(404, null);
    nock(baseURL)
      .get(`${apiUri}/underenheter/${orgNr}`)
      .reply(200, expectedReturn);

    try {
      const result = await getOrganisasjonsNavn(orgNr);
      expect(result.data).toEqual(expectedReturn);
    } catch (error) {
      throw error;
    }
  });

});
