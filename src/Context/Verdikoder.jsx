import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { getVerdikoder } from '../lib/inntektApiClient';

const VerdikoderContext = createContext({});

const Verdikoder = ({ children }) => {
  const [verdikoder, setVerdikoder] = useState([]);

  useEffect(() => {
    const getVerdikoderFromApi = async () => {
      let result;
      if (process.env.NODE_ENV !== 'production') {
        result = await axios(
          `${process.env.PUBLIC_URL}/mock/verdikoder.json`,
        );
      } else {
        result = await getVerdikoder();
      }
      setVerdikoder(result.data);
    };


    getVerdikoderFromApi();
  }, []);

  return (
    <VerdikoderContext.Provider value={verdikoder}>
      {children}
    </VerdikoderContext.Provider>
  );
};

Verdikoder.propTypes = {
  children: PropTypes.element.isRequired,
};


export { Verdikoder, VerdikoderContext };
