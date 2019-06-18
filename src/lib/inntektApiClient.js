import axios from 'axios';

export const getInntekt = async (request) => {
  try {
    return await axios({
      method: 'get',
      url: `/api/v1/inntekt/uklassifisert/${request.aktørId}/${request.vedtakId}/${request.beregningsDato}`,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getUncachedInntekt = async (request) => {
  try {
    return await axios({
      method: 'get',
      url: `/api/v1/inntekt/uklassifisert/uncached/${request.aktørId}/${request.vedtakId}/${request.beregningsDato}`,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const lagreInntekt = async (request) => {
  try {
    return await axios({
      method: 'post',
      url: '/api/v1/inntekt/uklassifisert/update',
      data: request,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getVerdikoder = async () => {
  try {
    return await axios({
      method: 'get',
      url: '/api/v1/inntekt/verdikoder',
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getName = async (request) => {
  try {
    return await axios({
      method: 'post',
      url: '/api/v1/aktoer/name',
      data: request,
    });
  } catch (error) {
    throw new Error(error);
  }
};
