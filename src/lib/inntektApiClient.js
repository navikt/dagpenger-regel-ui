const axios = require('axios');


export async function getInntekt(baseUrl, request) {
  return await axios({
    method: 'post',
    url: `${baseUrl}/api/v1/inntekt`,
    data: request,
  }).then(function (response) {
    return response;
  })
    .catch(function (error) {
      return error;
    })
}

export async function lagreInntekt(baseUrl, request) {
  return await axios({
    method: 'post',
    url: `${baseUrl}/api/v1/inntekt/update`,
    data: request,
  }).then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    })
}

