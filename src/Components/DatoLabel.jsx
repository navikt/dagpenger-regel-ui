import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';


const DatoLabel = ({ dato }) => (
  <Element>{dato}</Element>
);

DatoLabel.propTypes = {
  dato: PropTypes.string.isRequired,
};

export default DatoLabel;
