import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

const formatDato = (dato, datoFormat) => format(dato, datoFormat, { locale: nb });

const DatoLabel = ({ dato, datoFormat }) => (
  <>{formatDato(new Date(dato), datoFormat)}</>

);

DatoLabel.propTypes = {
  dato: PropTypes.string.isRequired,
  datoFormat: PropTypes.string.isRequired,
};

export default DatoLabel;
