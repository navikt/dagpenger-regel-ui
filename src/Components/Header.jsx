import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { ReactComponent as NavLogo } from '../images/nav.svg';

export const Header = () => (
  <header role="banner">
    <div className="dekorator flex">
      <NavLogo className="logo" />
      <Systemtittel>Dagpenger-inntektregistrering</Systemtittel>
      <div className="flexend">NAVansatt</div>
    </div>
  </header>
);

export default Header;
