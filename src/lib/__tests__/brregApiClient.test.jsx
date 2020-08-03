import nock from 'nock';
import { getOrganisasjonsNavn } from '../brregApiClient';

const baseURL = 'http://localhost';


const apiUri = '/api/v1/enhetsregisteret/enhet/';


describe('BrregApiClient', () => {
  it('Should handle 200 response on org name lookup', async () => {
    const orgNr = 12345678;
    const expectedReturn = { organisasjonsnummer: '12345678', navn: 'Et navn' };
    nock(baseURL)
      .get(`${apiUri}/${orgNr}`)
      .reply(200, expectedReturn);

    try {
      const result = await getOrganisasjonsNavn(orgNr);
      expect(result.data).toEqual(expectedReturn);
    } catch (error) {
      throw error;
    }
  });

});
