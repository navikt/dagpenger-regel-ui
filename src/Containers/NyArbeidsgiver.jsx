import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import InputField from '../Components/InputField';
import { RadioGroupField } from '../Components/RadioGroupField';
import { RadioOption } from '../Components/RadioOption';
import { required, hasValidOrgNumber, hasValidFodselsnummer } from '../Utils/validering';

// todo fikse stringifyvalues
const NyArbeidsgiver = (props) => {
  const {
    handleSubmit,
    isSubmitting,
    closeModal,
    isValid,
    values,
    errors,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      {JSON.stringify(errors)}
      <Undertittel>
      Legg til ny arbeidsgiver
      </Undertittel>

      <RadioGroupField
        label="Type aktør?"
        name="aktoerType"
        validate={required}
      >
        <RadioOption value="ORGANISASJON" label="Virksomhet" />
        <RadioOption value="NATURLIG_IDENT" label="Privatperson" />

      </RadioGroupField>
      {values.aktoerType === 'ORGANISASJON' && (
      <InputField
        label="Org.Nr"
        name="identifikator"
        validate={hasValidOrgNumber}
      />
      )}

      {values.aktoerType === 'NATURLIG_IDENT' && (
      <InputField
        label="Fødselsnummer"
        name="identifikator"
        validate={hasValidFodselsnummer}
      />
      )}

      <div className="knapprad">
        <Hovedknapp
          htmlType="submit"
          onClick={() => handleSubmit()}
          disabled={!isValid || isSubmitting}
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
    </form>
  );
};

NyArbeidsgiver.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
};

export default withFormik({
  mapPropsToValues: props => ({
    identifikator: undefined,
    navn: undefined,
    aktoerType: undefined,
  }),

  validate: (values, props) => {
    const errors = {};
    if (props.arbeidsgivere.some(arbeidsgiver => arbeidsgiver.identifikator === values.identifikator)) {
      errors.identifikator = 'Arbeidsgiver eksisterer allerede';
    }
    return errors;
  },

  handleSubmit: (values, { setSubmitting, props }) => {
    const { arrayHelpers, closeModal } = props;
    arrayHelpers.push({
      identifikator: values.identifikator,
      navn: values.navn,
      aktoerType: values.aktoerType,
    });
    setSubmitting(false);
    closeModal();
  },

  displayName: 'NyArbeidsgiverForm',
})(NyArbeidsgiver);
