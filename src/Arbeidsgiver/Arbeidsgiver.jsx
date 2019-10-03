import React from 'react';
import PropTypes from 'prop-types';
import { Element, EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import aktørTyper from '../Kodeverk/aktoerTyper';

const getAktoerType = aktoerType => (aktoerType === aktørTyper.ORGANISASJON ? 'Org. nr' : 'FNR');

const Arbeidsgiver = ({ arbeidsgiver }) => {
  const { navn, identifikator, __typename } = arbeidsgiver;
  return (
    <div className="item arbeidsgiver">
      {navn && <Undertittel>{navn}</Undertittel>}
      <EtikettLiten>{getAktoerType(__typename)}</EtikettLiten>
      <Element>{identifikator}</Element>
    </div>
  );
};

Arbeidsgiver.propTypes = {
  arbeidsgiver: PropTypes.shape().isRequired,
};

export default Arbeidsgiver;
