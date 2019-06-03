import React from 'react';
import PropTypes from 'prop-types';
import { Field, withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import { RadioGroupField } from '../Components/RadioGroupField';
import InputField from '../Components/InputField';
import { RadioOption } from '../Components/RadioOption';
import { required } from '../Utils/validering';
import DatoLabel from '../Components/DatoLabel';
import { MMMM_YYYY_FORMAT } from '../Utils/datoFormat';
import { DisplayFormikState } from '../Utils/formikUtils';


// TODO denne er hardkodet for nå, byttets ut med de feltene vi trenger
const nyInntektTemplate = {
  // beloep: '666.66',
  // beskrivelse: 'Test ny',
  fordel: 'kontantytelse',
  informasjonsstatus: 'InngaarAlltid',
  // inngaarIGrunnlagForTrekk: true,
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
  // utbetaltIMaaned: '2017-09',
  // utloeserArbeidsgiveravgift: true,
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

    <InputField
      beskrivelse="Beskrivelse"
      name="beskrivelse"
      validate={required}
    />

    <InputField
      beskrivelse="Beløp"
      name="beloep"
      validate={required}
      type="number"
    />
    <RadioGroupField
      label="Utløser arbeidsgiveravgift?"
      name="utloeserArbeidsgiveravgift"
      validate={[required]}
    >
      <RadioOption value label="Ja" />
      <RadioOption value={false} label="Nei" />
    </RadioGroupField>

    <RadioGroupField
      label="Inngår i grunnlag for trekk?"
      name="inngaarIGrunnlagForTrekk"
      validate={[required]}
    >
      <RadioOption value label="Ja" />
      <RadioOption value={false} label="Nei" />
    </RadioGroupField>

    <DisplayFormikState {...values} />

    <div className="knapprad">
      <Hovedknapp
        htmlType="submit"
        onClick={() => {
          arrayHelpers.insert(0, {
            ...nyInntektTemplate,
            beskrivelse: values.beskrivelse,
            beloep: values.beloep,
            utbetaltIMaaned: dato,
            utloeserArbeidsgiveravgift: values.utloeserArbeidsgiveravgift,
            inngaarIGrunnlagForTrekk: values.inngaarIGrunnlagForTrekk,
          });
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
    </div>
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
  mapPropsToValues: () => ({
    beskrivelse: '',
    beloep: '0.00',
    utloeserArbeidsgiveravgift: null,
    inngaarIGrunnlagForTrekk: null,
  }),
  // legg til validering og submit

})(NyInntekt);
