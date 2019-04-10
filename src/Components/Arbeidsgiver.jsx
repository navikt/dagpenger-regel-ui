import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel, Element, EtikettLiten } from 'nav-frontend-typografi';

import ArbeidsgiverPropType from '../PropTypes/arbeidsgiverPropType';

const Arbeidsgiver = ({ arbeidsgiver }) => (
  <div className="item arbeidsgiver">
    <Undertittel>{arbeidsgiver.navn}</Undertittel>
    <EtikettLiten>Org nr</EtikettLiten>
    <Element>{arbeidsgiver.identifikator}</Element>
  </div>
);

Arbeidsgiver.propTypes = {
  arbeidsgiver: PropTypes.shape(ArbeidsgiverPropType).isRequired,
};

export default Arbeidsgiver;
