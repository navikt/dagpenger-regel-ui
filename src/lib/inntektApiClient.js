const axios = require('axios');


async function getInntekt(baseUrl, request) {
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

export default getInntekt;
