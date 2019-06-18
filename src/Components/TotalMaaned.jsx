import React from 'react';
import PropTypes from 'prop-types';


const maanedStyle = index => `
.maaned--total--${index} {
  grid-area: maaned--total--${index};
}
`;

const TotalMaaned = ({ index }) => (
  <>
    <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
      __html: maanedStyle(index),
    }}
    />
    <div className={`item maaned total maaned--total--${index}`}>
      Total
    </div>
  </>
);

TotalMaaned.propTypes = {
  index: PropTypes.string.isRequired,
};

export default TotalMaaned;
