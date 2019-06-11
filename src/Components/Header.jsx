import React, { useState } from 'react';
import axios from 'axios';
import { Systemtittel } from 'nav-frontend-typografi';
import { ReactComponent as NavLogo } from '../images/nav.svg';

export const Header = () => {
  const [errors, setError] = useState({ isError: false, status: null, statusText: null });

  // apply interceptor on response
  axios.interceptors.response.use(
    response => response,
    error => setError({ isError: true, ...error.response }),
  );


  return (
    <header role="banner">
      <div className="dekorator flex">
        <NavLogo className="logo" />
        <Systemtittel>Dagpenger</Systemtittel>
        <div className="flexend">NAVansatt</div>
      </div>
      {errors.isError && <div className="feilmelding">{`${errors.status} ${errors.statusText}`}</div>}
    </header>
  );
};

export default Header;
