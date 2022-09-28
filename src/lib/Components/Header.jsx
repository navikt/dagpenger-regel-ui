import { Systemtittel } from "nav-frontend-typografi";
import NavLogo from "../../assets/svg/nav.svg";

function Header() {
  return (
    <header role="banner">
      <div className="dekorator flex">
        <NavLogo className="logo" />
        <Systemtittel>Dagpenger-inntektsregistrering</Systemtittel>
        <div className="flexend noprint">NAVansatt</div>
      </div>
    </header>
  );
}

export default Header;
