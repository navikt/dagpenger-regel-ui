import axios from 'axios';

const apiUri = '/api/v1/inntekt';
const apiUklassifisertUri = `${apiUri}/uklassifisert`;
const apiUncachedUri = `${apiUklassifisertUri}/uncached`;

export const getInntekt = async (uri) => {
  try {
    return await axios({
      method: 'get',
      url: `${apiUklassifisertUri}/${uri.aktørId}/${uri.vedtakId}/${uri.beregningsDato}`,
    });
  } catch (error) {
    return error;
  }
};


export const getUncachedInntekt = async (uri) => {
  try {
    return await axios({
      method: 'get',
      url: `${apiUncachedUri}/${uri.aktørId}/${uri.vedtakId}/${uri.beregningsDato}`,
    });
  } catch (error) {
    return error;
  }
};

// todo post til uncached hvis henter nye opplysninger
// todo legge til ${request.aktørId}/${request.vedtakId}/${request.beregningsDato}`,
export const lagreInntekt = async (request, isUncached, uri) => {
  try {
    return await axios({
      method: 'post',
      url: isUncached
        ? `${apiUncachedUri}/${uri.aktørId}/${uri.vedtakId}/${uri.beregningsDato}`
        : `${apiUklassifisertUri}/${uri.aktørId}/${uri.vedtakId}/${uri.beregningsDato}`,
      data: request,
    });
  } catch (error) {
    return error;
  }
};

export const getVerdikoder = async () => {
  try {
    return await axios({
      method: 'get',
      url: `${apiUri}/verdikoder`,
    });
  } catch (error) {
    return error;
  }
};

