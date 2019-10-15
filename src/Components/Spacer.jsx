import React from 'react';
import PropTypes from 'prop-types';

const Spacer = ({ fourPx, eightPx, sixteenPx, twentyPx }) => {
  let height = 'fourPx';

  if (eightPx) {
    height = 'fourPx';
  } else if (sixteenPx) {
    height = 'sixteenPx';
  } else if (twentyPx) {
    height = 'twentyPx';
  } else if (fourPx) {
    height = 'fourPx';
  }

  return <div className={`spacer ${height}`} />;
};

Spacer.propTypes = {
  fourPx: PropTypes.bool,
  eightPx: PropTypes.bool,
  sixteenPx: PropTypes.bool,
  twentyPx: PropTypes.bool,
};

Spacer.defaultProps = {
  fourPx: false,
  eightPx: false,
  sixteenPx: false,
  twentyPx: false,
};

export default Spacer;
