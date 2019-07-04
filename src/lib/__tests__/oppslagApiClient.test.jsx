import nock from 'nock';
import { getOrganisasjonsNavn, getPersonNavn } from '../oppslagApiClient';

const baseURL = 'http://localhost';


const apiUri = '/oppslag/api';


describe('OppslagApiClient', () => {
  it('Should handle 200 response on org name lookup', async () => {
    const orgNr = 12345678;
    const expectedReturn = { orgNr: '12345678', navn: 'Et navn' };
    nock(baseURL)
      .get(`${apiUri}/organisasjon/${orgNr}`)
      .reply(200, expectedReturn);

    try {
      const result = await getOrganisasjonsNavn(orgNr);
      expect(result.data).toEqual(expectedReturn);
    } catch (error) {
      throw error;
    }
  });

  it('Should handle 200 response on person name lookup', async () => {
    const data = { fødselsnummer: '12345678901' };

    const expectedReturn = {
      etternavn: 'Test', fornavn: 'Test', mellomnavn: 'Testesen', sammensattNavn: 'Test Testesen Test',
    };
    nock(baseURL)
      .post(`${apiUri}/person/name`, data)
      .reply(200, expectedReturn);
    try {
      const result = await getPersonNavn(data);
      expect(result.data).toEqual(expectedReturn);
    } catch (error) {
      throw error;
    }
  });
});
