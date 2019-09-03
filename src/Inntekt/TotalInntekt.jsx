import React from 'react';
import PropTypes from 'prop-types';
import { Ingress } from 'nav-frontend-typografi';
import { formatertPengesum } from '../Utils/currencyUtils';

const TotalInntekt = ({ total }) => {
  console.log('total', total);
  return <Ingress>{formatertPengesum(total)}</Ingress>;
};

TotalInntekt.propTypes = {
  total: PropTypes.number.isRequired,
};

export default TotalInntekt;
