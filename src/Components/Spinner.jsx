import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';

const Spinner = props => (
  <div className="flex">
    <NavFrontendSpinner {...props} />
  </div>
);

export default Spinner;
