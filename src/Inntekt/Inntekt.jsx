import React from 'react';
import PropTypes from 'prop-types';
import Postering from './Postering';
import TotalInntekt from './TotalInntekt';

const sumInntekter = inntekter => {
  const samletInntekt = new Set(...inntekter);
  return [...samletInntekt].reduce((acc, val) => Number(acc) + Number(val.beloep), 0);
};

const Inntekt = ({ arbeidsgiver, arbeidsgiverIndex, readOnly }) => {
  return Object.keys(arbeidsgiver.posteringer)
    .sort()
    .map((dato, index) => {
      return (
        <React.Fragment key={`${arbeidsgiver}${dato}`}>
          <div className="cell item inntekter">
            <Postering readOnly={readOnly} arbeidsgiver={arbeidsgiver} dato={dato} arbeidsgiverIndex={arbeidsgiverIndex} />
          </div>
          {(index + 1) % 12 === 0 && (
            <div className="cell item inntekter total">
              <TotalInntekt total={sumInntekter(Object.values(arbeidsgiver.posteringer).slice(index - 12, index))} />
            </div>
          )}
        </React.Fragment>
      );
    });
};

Inntekt.propTypes = {
  arbeidsgiver: PropTypes.shape().isRequired,
  arbeidsgiverIndex: PropTypes.number.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default Inntekt;
