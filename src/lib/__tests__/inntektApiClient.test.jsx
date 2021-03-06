import nock from 'nock';
import { getInntekt, lagreInntekt, getVerdikoder } from '../inntektApiClient';
import verdikoder from '../../../public/mock/verdikoder.json';

const baseURL = 'http://localhost';

const apiUri = '/api/v1/inntekt';
const apiUklassifisertUri = `${apiUri}/uklassifisert`;
const apiUncachedUri = `${apiUklassifisertUri}/uncached`;

const uri = {
  aktørId: '111',
  kontekst: 'vedtak',
  vedtakId: 12345,
  beregningsDato: '2019-05-01',
};

const isUncached = true;

describe('InntektApiClient', () => {
  it('Should handle 200 response', async () => {
    const expectedReturn = 'data';

    nock(baseURL)
      .get(`${apiUklassifisertUri}/${uri.aktørId}/${uri.kontekst}/${uri.vedtakId}/${uri.beregningsDato}`)
      .reply(200, expectedReturn);

    await getInntekt(uri)
      .then(result => {
        expect(result.data).toEqual(expectedReturn);
      })
      .catch(error => {
        throw error;
      });
  });

  it('Should handle 500 response', async () => {
    nock(baseURL)
      .get(`${apiUklassifisertUri}/${uri.aktørId}/${uri.kontekst}/${uri.vedtakId}/${uri.beregningsDato}`)
      .reply(500, {});

    try {
      await getInntekt(uri);
    } catch (e) {
      expect(e.response.statusText).toMatch('Internal Server Error');
    }
  });

  it('Should save inntekt with 200', async () => {
    const data = { field: '123' };
    nock(baseURL)
      .post(`${apiUncachedUri}/${uri.aktørId}/${uri.kontekst}/${uri.vedtakId}/${uri.beregningsDato}`, data)
      .reply(200, { success: true });

    await lagreInntekt(data, isUncached, uri)
      .then(result => {
        expect(result.data).toEqual({ success: true });
      })
      .catch(error => {
        throw error;
      });
  });

  it('Should fail to save inntekt', async () => {
    const data = { field: '123' };
    nock(baseURL)
      .post(`${apiUncachedUri}/${uri.aktørId}/${uri.kontekst}/${uri.vedtakId}/${uri.beregningsDato}`, data)
      .reply(500, {});

    try {
      await lagreInntekt(data);
    } catch (e) {
      expect(e.response.statusText).toMatch('Internal Server Error');
    }
  });

  it('Skal hente verdikoder', async () => {
    nock(baseURL)
      .get(`${apiUri}/verdikoder`)
      .reply(200, verdikoder);

    try {
      const result = await getVerdikoder();
      expect(result.data).toEqual(verdikoder);
    } catch (error) {
      throw error;
    }
  });
});
