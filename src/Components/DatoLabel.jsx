import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Element } from 'nav-frontend-typografi';

const formatDato = (dato, datoFormat) => format(dato, datoFormat, { locale: nb });

const DatoLabel = ({ dato, datoFormat }) => (
  <Element>{formatDato(new Date(dato), datoFormat)}</Element>

);

DatoLabel.propTypes = {
  dato: PropTypes.string.isRequired,
  datoFormat: PropTypes.string.isRequired,
};

export default DatoLabel;
