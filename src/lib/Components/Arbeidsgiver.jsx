import React from "react";
import { Element, Undertekst, Undertittel } from "nav-frontend-typografi";
import aktørTyper from "../Kodeverk/aktoerTyper";
import PropTypes from "prop-types";

const ArbeidsgiverPropType = PropTypes.shape({
  identifikator: PropTypes.string.isRequired,
  navn: PropTypes.string,
});

const getAktoerType = (aktoerType) =>
  aktoerType === aktørTyper.ORGANISASJON ? "Org. nr" : "FNR";

const arbeidsgiverStyle = (identifikator) => `
.arbeidsgiver--${identifikator} {
  grid-area: arbeidsgiver--${identifikator};
}
`;

function Arbeidsgiver({ arbeidsgiver }) {
  const { navn, identifikator, aktoerType } = arbeidsgiver;
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          // eslint-disable-line react/no-danger
          __html: arbeidsgiverStyle(identifikator),
        }}
      />
      <div className={`item arbeidsgiver arbeidsgiver--${identifikator}`}>
        {navn && <Undertittel>{navn}</Undertittel>}
        <Undertekst>{getAktoerType(aktoerType)}</Undertekst>
        <Element>{identifikator}</Element>
      </div>
    </>
  );
}

Arbeidsgiver.propTypes = {
  arbeidsgiver: ArbeidsgiverPropType.isRequired,
};

export default Arbeidsgiver;
