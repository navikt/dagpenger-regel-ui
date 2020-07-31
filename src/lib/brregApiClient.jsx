import axios from 'axios';

const apiUri = '/enhetsregisteret/api';

export const getOrganisasjonsNavn = async (orgNr) => {
  try {
    let result = await axios({
      method: 'get',
      url: `${apiUri}/enheter/${orgNr}`,
      validateStatus(status) {
        return status < 500; // Reject only if the status code is greater than or equal to 500
      },
    });
    if (result.status === 404) {
      return await axios({
        method: 'get',
        url: `${apiUri}/underenheter/${orgNr}`,
        validateStatus(status) {
          return status < 500; // Reject only if the status code is greater than or equal to 500
        },
      })
    } else {
      return result
    }

  } catch (error) {
    return error;
  }
};
