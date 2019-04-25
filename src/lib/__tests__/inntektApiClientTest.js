import nock from 'nock'
import getInntekt from '../inntektApiClient'

it("Should handle 200 response", async () => {

  const expectedReturn = 'data';
  let inntektApiRequest = {
    aktorId: "111",
    vedtakId: 12345,
    beregningsDato: '2019-05-01'
  };
  let baseUrl = 'http://localhost';
  nock(baseUrl)
    .post('/v1/inntektkomponenten', inntektApiRequest)
    .reply(200, expectedReturn);


  const result = await getInntekt(baseUrl, inntektApiRequest);
  expect(result.data).toEqual(expectedReturn)

});

it("Should handle 500 response", async () => {

  let inntektApiRequest = {
    aktorId: "111",
    vedtakId: 12345,
    beregningsDato: '2019-05-01'
  };
  let baseUrl = 'http://localhost';
  nock(baseUrl)
    .post('/v1/inntektkomponenten', inntektApiRequest)
    .reply(500, {})

  try {
    await getInntekt(baseUrl, inntektApiRequest);
  } catch (e) {
    expect(e.response.statusText).toMatch('Internal Server Error');
  }

});
