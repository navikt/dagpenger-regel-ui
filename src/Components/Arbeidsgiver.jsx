import React from 'react';
import { Undertittel, Element, EtikettLiten } from 'nav-frontend-typografi';

const Arbeidsgiver = ({ arbeidsgiver }) => (
  <div className="item arbeidsgiver">
    <Undertittel>{arbeidsgiver.navn}</Undertittel>
    <EtikettLiten>Org nr</EtikettLiten>
    <Element>{arbeidsgiver.identifikator}</Element>
  </div>
);

export default Arbeidsgiver;
