import axios from 'axios';

export const getInntekt = async (request) => await axios({
  method: 'get',
  url: `/api/v1/inntekt/uklassifisert/${request.aktørId}/${request.vedtakId}/${request.beregningsDato}`,
}).then(response => response)
  .catch(error => error);

export const lagreInntekt = async (request) => await axios({
  method: 'post',
  url: `/api/v1/inntekt/uklassifisert/update`,
  data: request,
}).then(response => response)
  .catch(error => error);
