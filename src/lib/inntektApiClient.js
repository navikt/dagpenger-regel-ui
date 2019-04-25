const axios = require('axios');


async function getInntekt(baseUrl, requst) {
  console.log(requst)
  return await axios({
    method: 'post',
    url: `${baseUrl}/api/v1/inntekt`,
    data: requst,
  }).then(function (response) {
    console.log(response.data);
    return response;
  })
    .catch(function (error) {
      console.log(error.response);
      return error;
    })
}

export default getInntekt;
