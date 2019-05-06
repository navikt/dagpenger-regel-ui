import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Element, EtikettLiten } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Input } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { Field } from 'formik';

const sumInntekter = inntekter => inntekter.reduce((acc, val) => acc + val.beloep, 0);

const formatertPengesum = tall => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' }).format(tall);

const InputField = ({
  beskrivelse, field, form, ...props
}) => (<Input label={beskrivelse} type="number" {...field} value={field.value} />);

const ReadOnlyField = ({
  beskrivelse, field, form, ...props
}) => (
  <div>
    <EtikettLiten>{beskrivelse}</EtikettLiten>
    <Element className="inntektbeloep">{formatertPengesum(field.value)}</Element>
  </div>
);

const Inntekt = ({
  readOnly, inntekter, rowId, columnId, monthIndex
}) => {
  const [editMode, setEditMode] = useState(true);

  return (
    <div className={`item inntekter inntekter--${rowId}--${columnId}`}>
      <Ekspanderbartpanel
        tittel={formatertPengesum(sumInntekter(inntekter.filter(inntekt => inntekt.virksomhet.identifikator === rowId)))}
        tittelProps="element"
      >
        {!readOnly && <Knapp htmlType="button" onClick={() => setEditMode(!editMode)}>Rediger</Knapp>}
        {inntekter.map((inntekt, index) => (
          inntekt.virksomhet.identifikator === rowId &&
          <div key={inntekt.beskrivelse} className="inntekt">
            <Field beskrivelse={inntekt.beskrivelse} name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].beloep`} component={editMode ? ReadOnlyField : InputField} />
          </div>
        ))}
      </Ekspanderbartpanel>
    </div>
  );
};

Inntekt.propTypes = {
  inntekter: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string,
    beskrivelse: PropTypes.string,
    beloep: PropTypes.number,
  })).isRequired,
  rowId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
};

export default Inntekt;
