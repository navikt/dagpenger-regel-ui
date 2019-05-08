import React from 'react';
import PropTypes from 'prop-types';
import { Element, EtikettLiten } from 'nav-frontend-typografi';
import { formatertPengesum } from '../Utils/currencyFormat';

export const ReadOnlyField = ({
  beskrivelse, field,
}) => (
  <div>
    <EtikettLiten>{beskrivelse}</EtikettLiten>
    <Element className="inntektbeloep">{formatertPengesum(field.value)}</Element>
  </div>
);


ReadOnlyField.propTypes = {
  beskrivelse: PropTypes.string.isRequired,
  field: PropTypes.shape().isRequired,
};

export default ReadOnlyField;
