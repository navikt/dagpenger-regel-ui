import React from 'react';
import { Element, EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import aktørTyper from '../Kodeverk/aktoerTyper';
import ArbeidsgiverPropType from '../PropTypes/arbeidsgiverPropType';


const getAktoerType = aktoerType => (aktoerType === aktørTyper.ORGANISASJON ? 'Org. nr' : 'FNR');

const arbeidsgiverStyle = identifikator => `
.arbeidsgiver--${identifikator} {
  grid-area: arbeidsgiver--${identifikator};
}
`;

const Arbeidsgiver = ({ arbeidsgiver }) => {
  const { navn, identifikator, aktoerType } = arbeidsgiver;
  return (
    <>
      <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: arbeidsgiverStyle(identifikator),
      }}
      />
      <div className={`item arbeidsgiver arbeidsgiver--${identifikator}`}>
        {navn && <Undertittel>{navn}</Undertittel>}
        <EtikettLiten>{getAktoerType(aktoerType)}</EtikettLiten>
        <Element>{identifikator}</Element>
      </div>
    </>
  );
};

Arbeidsgiver.propTypes = {
  arbeidsgiver: ArbeidsgiverPropType.isRequired,
};

export default Arbeidsgiver;
