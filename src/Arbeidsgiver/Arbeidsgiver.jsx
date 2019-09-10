import React from 'react';
import PropTypes from 'prop-types';
import { Element, EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import aktørTyper from '../Kodeverk/aktoerTyper';

const getAktoerType = aktoerType => (aktoerType === aktørTyper.ORGANISASJON ? 'Org. nr' : 'FNR');
const getAktoerIdent = (aktoerType, arbeidsgiver) => (aktoerType === aktørTyper.ORGANISASJON ? arbeidsgiver.organisasjonsnummer : arbeidsgiver.naturligIdent);

const Arbeidsgiver = ({ arbeidsgiver }) => {
  const { navn, __typename } = arbeidsgiver;
  return (
    <div className="cell item arbeidsgiver">
      {navn && <Undertittel>{navn}</Undertittel>}
      <EtikettLiten>{getAktoerType(__typename)}</EtikettLiten>
      <Element>{getAktoerIdent(__typename, arbeidsgiver)}</Element>
    </div>
  );
};

Arbeidsgiver.propTypes = {
  arbeidsgiver: PropTypes.shape().isRequired,
};

export default Arbeidsgiver;
