import React from 'react';

import '../images/nav.svg';


const Ikon = ({ navn }) => (
  <svg>
    <use xlinkHref={`/#${navn}`} />
  </svg>
);

export default Ikon;
