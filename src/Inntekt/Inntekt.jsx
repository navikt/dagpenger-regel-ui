import React from 'react';
import PropTypes from 'prop-types';
import Postering from './Postering';
import TotalInntekt from './TotalInntekt';
import DatoLabel from '../Components/DatoLabel';
import { MMMM_YYYY_FORMAT } from '../Utils/datoFormat';

const sortObject = object => {
  const array = [];
  let prop;
  // eslint-disable-next-line no-restricted-syntax
  for (prop in object) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(prop)) {
      array.push({
        key: prop,
        totalForDato: object[prop].reduce((acc, val) => Number(acc) + Number(val.beloep), 0),
      });
    } else {
      array.push({});
    }
  }
  array.sort((a, b) => a.key.localeCompare(b.key));
  return array; // returns array
};

const sumInntekter = (inntekter, index) => {
  const sortedInntekter = sortObject(inntekter);
  // først sortere inntekter så hente ut verdier
  return sortedInntekter.slice(index - 11, index + 1).reduce((acc, val) => Number(acc) + Number(val.totalForDato), 0);
};

const Inntekt = ({ arbeidsgiver, arbeidsgiverIndex, readOnly }) =>
  Object.keys(arbeidsgiver.posteringer)
    .sort()
    .map((dato, index) => {
      return (
        <React.Fragment key={`${arbeidsgiver}${dato}`}>
          <div className="item maaned bareprint">
            <DatoLabel dato={dato} datoFormat={MMMM_YYYY_FORMAT} />
          </div>
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

Inntekt.propTypes = {
  arbeidsgiver: PropTypes.shape().isRequired,
  arbeidsgiverIndex: PropTypes.number.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default Inntekt;
