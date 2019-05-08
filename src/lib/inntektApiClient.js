import axios from 'axios';

export const getInntekt = async (baseUrl, request) => await axios({
  method: 'post',
  url: `${baseUrl}/api/v1/inntekt`,
  data: request,
}).then(response => response)
  .catch(error => error);

export const lagreInntekt = async (baseUrl, request) => await axios({
  method: 'post',
  url: `${baseUrl}/api/v1/inntekt/update`,
  data: request,
}).then(response => response)
  .catch(error => error);
