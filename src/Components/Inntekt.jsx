import React from 'react';
import PropTypes from 'prop-types';
import { Element, EtikettLiten } from 'nav-frontend-typografi';

const Inntekt = ({ inntekter }) => (
  <div key={1} className="item inntekter">
    {inntekter.map(inntekt => (
      <div key={1} className="inntekt">
        <EtikettLiten>{inntekt.header}</EtikettLiten>
        <Element>{inntekt.beloep}</Element>
      </div>
    ))
    }
  </div>
);

Inntekt.propTypes = {
  inntekter: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string,
    beloep: PropTypes.number,
  })).isRequired,
};

export default Inntekt;
