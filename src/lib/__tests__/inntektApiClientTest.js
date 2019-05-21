import nock from 'nock'
import {getInntekt, lagreInntekt} from "../inntektApiClient";


it("Should handle 200 response", async () => {

  const expectedReturn = 'data';
  let inntektApiRequest = {
    aktørId: "111",
    vedtakId: 12345,
    beregningsDato: '2019-05-01'
  };
  nock('http://localhost')
    .get('/api/v1/inntekt/uklassifisert/111/12345/2019-05-01')
    .reply(200, expectedReturn);

  await getInntekt(inntektApiRequest).then(function (result) {
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
  nock('http://localhost')
    .get('/api/v1/inntekt/uklassifisert/111/12345/2019-05-01')
    .reply(500, {});

  try {
    await getInntekt(inntektApiRequest);
  } catch (e) {
    expect(e.response.statusText).toMatch('Internal Server Error');
  }

});

it("Should save inntekt with 200", async () => {
  let data = {field: "123"};
  nock('http://localhost')
    .post('/api/v1/inntekt/uklassifisert/update', data)
    .reply(200, {success: true});

  await lagreInntekt(data).then(function (result) {
    expect(result.data).toEqual({success: true})
  }).catch(function (error) {
    throw error
  });
});


it("Should fail to save inntekt", async () => {
  let data = {field: "123"};
  nock('http://localhost')
    .post('/api/v1/inntekt/uklassifisert/update', data)
    .reply(500, {});

  try {
    await lagreInntekt(data);
  } catch (e) {
    expect(e.response.statusText).toMatch('Internal Server Error');
  }
});
