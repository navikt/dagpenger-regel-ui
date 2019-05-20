import React from 'react';
import PropTypes from 'prop-types';
import { Field, withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import { SkjemaGruppe, Fieldset, Radio } from 'nav-frontend-skjema';

import { InputField } from '../Components/InputField';
import { required } from '../Utils/validering';
import DatoLabel from '../Components/DatoLabel';
import { MMMM_YYYY_FORMAT } from '../Utils/datoFormat';


// TODO denne er hardkodet for nå, byttets ut med de feltene vi trenger
const nyInntektTemplate = {
  beloep: '666.66',
  beskrivelse: 'Test ny',
  fordel: 'kontantytelse',
  informasjonsstatus: 'InngaarAlltid',
  inngaarIGrunnlagForTrekk: true,
  inntektType: 'LOENNSINNTEKT',
  inntektskilde: 'A-ordningen',
  inntektsmottaker: {
    aktoerType: 'NATURLIG_IDENT',
    identifikator: '99999999999',
  },
  inntektsperiodetype: 'Maaned',
  inntektsstatus: 'LoependeInnrapportert',
  leveringstidspunkt: '2019-02',
  opplysningspliktig: {
    aktoerType: 'ORGANISASJON',
    identifikator: '1111111',
  },
  utbetaltIMaaned: '2017-09',
  utloeserArbeidsgiveravgift: true,
  virksomhet: {
    aktoerType: 'ORGANISASJON',
    identifikator: '1111111',
    navn: 'Enenenenen',
  },
};

export const NyInntekt = ({
  arrayHelpers, arbeidsgiver, dato, closeModal, values,
}) => (
  <>
    <Undertittel>
      {`Legg til ny inntektspost for ${arbeidsgiver} i `}
      <DatoLabel dato={dato} datoFormat={MMMM_YYYY_FORMAT} />
    </Undertittel>

    <Field
      beskrivelse="Beskrivelse"
      name="beskrivelse"
      component={InputField}
      validate={required}
    />

    <Field
      beskrivelse="Beløp"
      name="beloep"
      component={InputField}
      validate={required}
      type="number"
    />

    <Field component={SkjemaGruppe} name="nyInntektUtloeserArbeidsgiveravgift">
      <Fieldset legend="Utløser arbeidsgiveravgift?">
        <Radio name="nyInntektUtloeserArbeidsgiveravgift" label="Ja" value />
        <Radio name="nyInntektUtloeserArbeidsgiveravgift" label="Nei" value={false} />
      </Fieldset>
    </Field>

    <Hovedknapp
      htmlType="button"
      onClick={() => {
        arrayHelpers.insert(0, {
          ...nyInntektTemplate,
          beskrivelse: values.beskrivelse,
          beloep: values.beloep,
        });
        closeModal();
      }
    }
    >
      Legg til
    </Hovedknapp>
    <Knapp
      htmlType="button"
      onClick={closeModal}
    >
      Avbryt
    </Knapp>
  </>
);

NyInntekt.propTypes = {
  arrayHelpers: PropTypes.shape().isRequired,
  arbeidsgiver: PropTypes.string.isRequired,
  dato: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  values: PropTypes.shape().isRequired,
};

export default withFormik({
  mapPropsToValues: () => ({ beskrivelse: '', beloep: '0.00' }),
})(NyInntekt);
