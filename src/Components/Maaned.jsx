import React from 'react';
import PropTypes from 'prop-types';
import DatoLabel from './DatoLabel';

const Maaned = ({ dato }) => (
  <div className="item maaned">
    <DatoLabel dato={dato} />
  </div>
);

Maaned.propTypes = {
  dato: PropTypes.string.isRequired,
};

export default Maaned;
