import axios from 'axios';

const apiUri = '/oppslag/api';

export const getOrganisasjonsNavn = async (orgNr) => {
  try {
    return await axios({
      method: 'get',
      url: `${apiUri}/organisasjon/${orgNr}`,
      validateStatus(status) {
        return status < 500; // Reject only if the status code is greater than or equal to 500
      },
    });
  } catch (error) {
    return error;
  }
};


export const getPersonNavn = async (request) => {
  try {
    return await axios({
      method: 'post',
      url: `${apiUri}/person/name`,
      data: request,
    });
  } catch (error) {
    return error;
  }
};
