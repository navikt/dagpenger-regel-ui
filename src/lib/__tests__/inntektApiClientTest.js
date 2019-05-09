import nock from 'nock'
import {getInntekt, lagreInntekt} from "../inntektApiClient";


it("Should handle 200 response", async () => {

  const expectedReturn = 'data';
  let inntektApiRequest = {
    aktorId: "111",
    vedtakId: 12345,
    beregningsDato: '2019-05-01'
  };
  let baseUrl = 'http://localhost';
  nock(baseUrl)
    .post('/api/v1/inntekt', inntektApiRequest)
    .reply(200, expectedReturn);


  await getInntekt(baseUrl, inntektApiRequest).then(function (result) {
    expect(result.data).toEqual(expectedReturn)
  })
    .catch(function (error) {
      throw error


    });
});

it("Should handle 500 response", async () => {

  let inntektApiRequest = {
    aktørId: "111",
    vedtakId: 12345,
    beregningsDato: '2019-05-01'
  };
  let baseUrl = 'http://localhost';
  nock(baseUrl)
    .post('/api/v1/inntekt', inntektApiRequest)
    .reply(500, {});

  try {
    await getInntekt(baseUrl, inntektApiRequest);
  } catch (e) {
    expect(e.response.statusText).toMatch('Internal Server Error');
  }

});

it("Should save inntekt with 200", async () => {
  let data = {field: "123"};
  let baseUrl = 'http://localhost';
  nock(baseUrl)
    .post('/api/v1/inntekt/update', data)
    .reply(200, {success: true});

  await lagreInntekt(baseUrl, data).then(function (result) {
    expect(result.data).toEqual({success: true})
  }).catch(function (error) {
    throw error
  });
});


it("Should fail to save inntekt", async () => {
  let data = {field: "123"};
  let baseUrl = 'http://localhost';
  nock(baseUrl)
    .post('/api/v1/inntekt/update', data)
    .reply(500, {});

  try {
    await lagreInntekt(baseUrl, data);
  } catch (e) {
    expect(e.response.statusText).toMatch('Internal Server Error');
  }
});
