import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import {Knapp} from 'nav-frontend-knapper';
import {Field} from 'formik';
import {InputField} from './InputField';
import {ReadOnlyField} from './ReadOnlyField';
import {required} from '../Utils/validering';
import {formatertPengesum} from '../Utils/currencyFormat';

const sumInntekter = inntekter => inntekter.reduce((acc, val) => Number(acc) + Number(val.beloep), 0);

const inntektStyle = (rowId, columnId) => `
.inntekter--${rowId}--${columnId} {
  grid-area: inntekter--${rowId}--${columnId};
}
`;

const Inntekt = ({
  readOnly, inntekter, rowId, columnId, monthIndex, formProps,
}) => {
  const [editMode, setEditMode] = useState(true);
  return (
    <>
      <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: inntektStyle(rowId, columnId),
      }}
      />
      <div className={`item inntekter inntekter--${rowId}--${columnId}`}>
        <Ekspanderbartpanel
          tittel={formatertPengesum(sumInntekter(inntekter
            .filter(inntekt => inntekt.virksomhet.identifikator === rowId)))}
          tittelProps="element"
        >

          {inntekter.map((inntekt, index) => (
            inntekt.virksomhet.identifikator === rowId
          && (
          <div key={inntekt.beskrivelse} className="inntekt">
            <Field
              beskrivelse={inntekt.beskrivelse}
              name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].beloep`}
              component={editMode ? ReadOnlyField : InputField}
              validate={required}
            />
          </div>
          )
          ))}
          {!readOnly && (
          <Knapp
            htmlType="button"
            mini
            onClick={() => setEditMode(formProps.isValid && !editMode)}
          >
            {editMode ? 'Rediger' : 'Oppdater'}
          </Knapp>
          )}
        </Ekspanderbartpanel>
      </div>
    </>
  );
};

Inntekt.propTypes = {
  inntekter: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string,
    beskrivelse: PropTypes.string,
    beloep: PropTypes.string,
  })).isRequired,
  readOnly: PropTypes.bool.isRequired,
  rowId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  monthIndex: PropTypes.number.isRequired,
  formProps: PropTypes.shape().isRequired, // TODO create a proptype for formik
};

export default Inntekt;
