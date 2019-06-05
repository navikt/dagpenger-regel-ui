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
import { inntektTyper } from '../Kodeverk/verdikoder';

const mapTypeInntekter = typer => typer
  .map(navn => (<option value={navn} key={navn}>{navn}</option>));

// todo lukke modal onsubmit
const NyInntekt = ({
  arbeidsgiver, dato, closeModal, values, handleSubmit,
}) => (
  <>
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

    <div className="knapprad">
      <Hovedknapp
        htmlType="submit"
        onClick={() => handleSubmit()}

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

    <DisplayFormikState {...values} />
  </>
);

NyInntekt.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  arbeidsgiver: PropTypes.string.isRequired,
  dato: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  values: PropTypes.shape().isRequired,
};

export default withFormik({
  mapPropsToValues: ({
    arrayHelpers, arbeidsgiver, dato, closeModal,
  }) => ({
    beskrivelse: '',
    beloep: '0.00',
    utloeserArbeidsgiveravgift: null,
    inngaarIGrunnlagForTrekk: null,
    inntektsmottaker: arrayHelpers.form.values.inntekt.ident,
    closeModal,
    arbeidsgiver,
    dato,
    arrayHelpers,
  }),
  // Custom sync validation
  validate: (values) => {
    const errors = {};

    if (!values.beskrivelse) {
      errors.beskrivelse = 'Required';
    }

    return errors;
  },

  handleSubmit: (values, { setSubmitting }) => {
    const { arrayHelpers, closeModal } = values;
    arrayHelpers.insert(0, {
      beskrivelse: values.beskrivelse,
      beloep: values.beloep,
      virksomhet: {
        aktoerType: 'ORGANISASJON',
        identifikator: values.arbeidsgiver,
        navn: 'Enenenenen',
      },
    });
    setSubmitting(false);
    closeModal();
  },

  displayName: 'nyInntekt',

})(NyInntekt);
