import axios from 'axios';

const apiUri = '/oppslag/api';

export const getOrganisasjonsNavn = async (orgNr) => {
  try {
    return await axios({
      method: 'get',
      url: `${apiUri}/organisasjon/${orgNr}`,
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
