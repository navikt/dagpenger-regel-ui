import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const LocaleContext = createContext({});

const Locale = ({ children }) => {
  const [locale, setLocale] = useState({});

  useEffect(() => {
    const getLocale = async () => {
      const result = await axios(`${process.env.PUBLIC_URL}/i18n/no.json`);
      setLocale(result.data);
    };

    getLocale();
  }, []);

  return (
    <LocaleContext.Provider value={locale}>
      {children}
    </LocaleContext.Provider>
  );
};

Locale.propTypes = {
  children: PropTypes.element.isRequired,
};


export { Locale, LocaleContext };
