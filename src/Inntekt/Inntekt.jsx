import React from 'react';
import PropTypes from 'prop-types';
import Postering from './Postering';
import TotalInntekt from './TotalInntekt';

const sortObject = obj => {
  const arr = [];
  let prop;
  // eslint-disable-next-line no-restricted-syntax
  for (prop in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        key: prop,
        totalForDato: obj[prop].reduce((acc, val) => Number(acc) + Number(val.beloep), 0),
      });
    } else {
      arr.push({});
    }
  }
  arr.sort((a, b) => a.key.localeCompare(b.key));
  return arr; // returns array
};

const sumInntekter = (inntekter, index) => {
  const sortedInntekter = sortObject(inntekter);
  // først sortere inntekter så hente ut verdier
  return sortedInntekter.slice(index - 11, index + 1).reduce((acc, val) => Number(acc) + Number(val.totalForDato), 0);
};

const Inntekt = ({ arbeidsgiver, arbeidsgiverIndex, readOnly }) => {
  const sortedPosteringer = Object.keys(arbeidsgiver.posteringer).sort();
  return sortedPosteringer.map((dato, index) => {
    return (
      <React.Fragment key={`${arbeidsgiver}${dato}`}>
        <div className="item inntekter">
          <Postering readOnly={readOnly} arbeidsgiver={arbeidsgiver} dato={dato} arbeidsgiverIndex={arbeidsgiverIndex} />
        </div>
        {(index + 1) % 12 === 0 && (
          <div className="item inntekter total">
            <TotalInntekt total={sumInntekter(arbeidsgiver.posteringer, index)} />
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
