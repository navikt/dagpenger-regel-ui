import React from 'react';
import PropTypes from 'prop-types';
import DatoLabel from './DatoLabel';

import { MMMM_YYYY_FORMAT } from '../Utils/datoFormat';

const Maaned = ({ maaned }) => (
  <div className={`item maaned maaned--${maaned}`}>
    <DatoLabel dato={maaned} datoFormat={MMMM_YYYY_FORMAT} />
  </div>
);

Maaned.propTypes = {
  maaned: PropTypes.string.isRequired,
};

export default Maaned;
