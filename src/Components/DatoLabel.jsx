import React from 'react';
import PropTypes from 'prop-types';
import { formatDato } from '../Utils/dateUtils';

const DatoLabel = ({ dato, datoFormat }) => (
  <>{formatDato(new Date(dato), datoFormat)}</>

);

DatoLabel.propTypes = {
  dato: PropTypes.string.isRequired,
  datoFormat: PropTypes.string.isRequired,
};

export default DatoLabel;
