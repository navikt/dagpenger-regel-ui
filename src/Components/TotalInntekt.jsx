import React from 'react';
import PropTypes from 'prop-types';


const maanedStyle = (index, identifikator) => `
.inntekter--${identifikator}--total--${index} {
  grid-area: inntekter--${identifikator}--total--${index};
}
`;

const TotalInntekt = ({ index, identifikator, total }) => (
  <>
    <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
      __html: maanedStyle(index, identifikator),
    }}
    />
    <div className={`item inntekter total inntekter--${identifikator}--total--${index}`}>
      {total}
    </div>
  </>
);

TotalInntekt.propTypes = {
  index: PropTypes.number.isRequired,
  identifikator: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
};

export default TotalInntekt;
