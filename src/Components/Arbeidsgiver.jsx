import React from 'react';
import { Element, EtikettLiten, Undertittel } from 'nav-frontend-typografi';

import ArbeidsgiverPropType from '../PropTypes/arbeidsgiverPropType';


const getAktoerType = aktoerType => (aktoerType === 'ORGANISASJON' ? 'Org. nr' : 'FNR');

const arbeidsgiverStyle = identifikator => `
.arbeidsgiver--${identifikator} {
  grid-area: arbeidsgiver--${identifikator};
}
`;

const Arbeidsgiver = ({ arbeidsgiver }) => (
  <>
    <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
      __html: arbeidsgiverStyle(arbeidsgiver.identifikator),
    }}
    />
    <div className={`item arbeidsgiver arbeidsgiver--${arbeidsgiver.identifikator}`}>
      {arbeidsgiver.navn && <Undertittel>{arbeidsgiver.navn}</Undertittel>}
      <EtikettLiten>{getAktoerType(arbeidsgiver.aktoerType)}</EtikettLiten>
      <Element>{arbeidsgiver.identifikator}</Element>
    </div>
  </>
);

Arbeidsgiver.propTypes = {
  arbeidsgiver: ArbeidsgiverPropType.isRequired,
};

export default Arbeidsgiver;
