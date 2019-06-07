import React from 'react';
import PropTypes from 'prop-types';

import '../images/nav.svg';
import '../images/slett.svg';


const Ikon = ({ navn }) => (
  <svg>
    <use xlinkHref={`/#${navn}`} />
  </svg>
);

Ikon.propTypes = {
  navn: PropTypes.string.isRequired,
};

export default Ikon;
