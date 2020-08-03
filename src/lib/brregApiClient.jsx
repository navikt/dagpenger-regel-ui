import axios from 'axios';

const apiUri = '/enhetsregisteret/v1/enhetsregisteret/enhet';

export const getOrganisasjonsNavn = async (orgNr) => {
  try {
    return await axios({
      method: 'get',
      url: `${apiUri}/${orgNr}`,
      validateStatus(status) {
        return status < 500; // Reject only if the status code is greater than or equal to 500
      },
    });
  } catch (error) {
    return error;
  }
};
