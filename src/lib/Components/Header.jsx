import { Systemtittel } from "nav-frontend-typografi";
import NavLogo from "../../assets/svg/nav.svg";
import React from "react";

function Header() {
  return (
    <header role="banner">
      <div className="dekorator flex">
        <img src={NavLogo} classname="logo" alt="" />;
        <Systemtittel>Dagpenger-inntektsregistrering</Systemtittel>
        <div className="flexend noprint">NAVansatt</div>
      </div>
    </header>
  );
}

export default Header;
