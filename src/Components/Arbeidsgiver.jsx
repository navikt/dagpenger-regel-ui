import React from 'react';
import { Element, EtikettLiten, Undertittel } from 'nav-frontend-typografi';

import ArbeidsgiverPropType from '../PropTypes/arbeidsgiverPropType';

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
      <EtikettLiten>Org nr</EtikettLiten>
      <Element>{arbeidsgiver.identifikator}</Element>
    </div>
  </>
);

Arbeidsgiver.propTypes = {
  arbeidsgiver: ArbeidsgiverPropType.isRequired,
};

export default Arbeidsgiver;
