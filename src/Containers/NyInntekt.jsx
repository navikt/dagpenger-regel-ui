import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import { RadioGroupField } from '../Components/RadioGroupField';
import InputField from '../Components/InputField';
import SelectField from '../Components/SelectField';
import { RadioOption } from '../Components/RadioOption';
import { required } from '../Utils/validering';
import DatoLabel from '../Components/DatoLabel';
import { MMMM_YYYY_FORMAT } from '../Utils/datoFormat';
import { DisplayFormikState } from '../Utils/formikUtils';

// to lage en compontent for dette
import { inntektTyper } from '../lib/verdikoder';

const mapTypeInntekter = typer => typer
  .map(navn => (<option value={navn} key={navn}>{navn}</option>));

// todo lukke modal onsubmit
const NyInntekt = ({
  arrayHelpers, arbeidsgiver, dato, closeModal, values,
}) => (
  <React.Fragment>
    <Undertittel>
      {`Legg til ny inntektspost for ${arbeidsgiver} i `}
      <DatoLabel dato={dato} datoFormat={MMMM_YYYY_FORMAT} />
    </Undertittel>

    <SelectField
      bredde="xl"
      label="Beskrivelse"
      selectValues={mapTypeInntekter(inntektTyper)}
      validate={[required]}
      name="beskrivelse"
      readOnly={false}
    />

    <InputField
      label="Beløp"
      name="beloep"
      validate={[required]}
      type="number"
      readOnly={false}
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
            beskrivelse: values.beskrivelse,
            beloep: values.beloep,
            utbetaltIMaaned: dato,
            utloeserArbeidsgiveravgift: values.utloeserArbeidsgiveravgift,
            inngaarIGrunnlagForTrekk: values.inngaarIGrunnlagForTrekk,
            inntektType: 'LOENNSINNTEKT',
            fordel: 'kontantytelse',
            informasjonsstatus: 'InngaarAlltid',
            inntektskilde: 'A-ordningen',
            leveringstidspunkt: '2019-02',
            inntektsperiodetype: 'Maaned',
            inntektsstatus: 'LoependeInnrapportert',
            virksomhet: {
              aktoerType: 'ORGANISASJON',
              identifikator: arbeidsgiver,
              navn: 'Enenenenen',
            },
            opplysningspliktig: {
              aktoerType: 'ORGANISASJON',
              identifikator: arbeidsgiver,
            },
            inntektsmottaker: {
              aktoerType: 'NATURLIG_IDENT',
              identifikator: '99999999999',
            },
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
  </React.Fragment>
);

NyInntekt.propTypes = {
  arrayHelpers: PropTypes.shape().isRequired,
  arbeidsgiver: PropTypes.string.isRequired,
  dato: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  values: PropTypes.shape().isRequired,
};

export default withFormik({
  mapPropsToValues: ({ props }) => ({
    beskrivelse: '',
    beloep: '0.00',
    utloeserArbeidsgiveravgift: null,
    inngaarIGrunnlagForTrekk: null,
  }),
  displayName: 'nyInntekt',
  // legg til validering og submit

})(NyInntekt);
