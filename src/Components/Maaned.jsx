import React from 'react';
import PropTypes from 'prop-types';
import DatoLabel from './DatoLabel';

const Maaned = ({ maaned }) => (
  <div className="item maaned">
    <DatoLabel dato={maaned} />
  </div>
);

Maaned.propTypes = {
  maaned: PropTypes.string.isRequired,
};

export default Maaned;
