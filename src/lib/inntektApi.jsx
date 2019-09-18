import axios from 'axios';

const apiUri = '/api/v1/inntekt';
const apiUklassifisertUri = `${apiUri}/uklassifisert`;
const apiUncachedUri = `${apiUklassifisertUri}/uncached`;

export const getInntekt = async uri => {
  try {
    return await axios({
      method: 'get',
      url: `${apiUklassifisertUri}/${uri.personId}/${uri.vedtakId}/${uri.beregningsdato}`,
    });
  } catch (error) {
    return error;
  }
};

export const getUncachedInntekt = async uri => {
  try {
    return await axios({
      method: 'get',
      url: `${apiUncachedUri}/${uri.personId}/${uri.vedtakId}/${uri.beregningsdato}`,
    });
  } catch (error) {
    return error;
  }
};

// todo post til uncached hvis henter nye opplysninger
// todo legge til ${request.aktørId}/${request.vedtakId}/${request.beregningsdato}`,
export const lagreInntekt = async (request, isUncached, uri) => {
  try {
    return await axios({
      method: 'post',
      url: isUncached
        ? `${apiUncachedUri}/${uri.personId}/${uri.vedtakId}/${uri.beregningsdato}`
        : `${apiUklassifisertUri}/${uri.personId}/${uri.vedtakId}/${uri.beregningsdato}`,
      data: request,
    });
  } catch (error) {
    return error;
  }
};
