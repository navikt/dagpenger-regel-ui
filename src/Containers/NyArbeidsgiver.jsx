import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import InputField from '../Components/InputField';
import SelectField from '../Components/SelectField';
import { required, hasValidOrgNumber } from '../Utils/validering';

import { aktoerType } from '../Kodeverk/verdikoder';

const mapTypeInntekter = typer => typer
  .map(navn => (<option value={navn} key={navn}>{navn}</option>));

// todo lukke modal onsubmit
const NyArbeidsgiver = (props) => {
  const {
    handleSubmit,
    isSubmitting,
    closeModal,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Undertittel>
      Legg til ny arbeidsgiver
      </Undertittel>

      <InputField
        label="Org.Nr"
        name="identifikator"
        validate={[required, hasValidOrgNumber]}
        type="number"
        readOnly={false}
      />

      <SelectField
        bredde="xl"
        label="Aktørtype"
        selectValues={mapTypeInntekter(aktoerType)}
        validate={[required]}
        name="aktoerType"
        readOnly={false}
      />

      <div className="knapprad">
        <Hovedknapp
          htmlType="submit"
          onClick={() => handleSubmit()}
          disabled={isSubmitting}
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
};

export default withFormik({
  mapPropsToValues: () => ({
    identifikator: undefined,
    navn: undefined,
    aktoerType: undefined,
  }),

  // Custom sync validation
  validate: (values) => {
    const errors = {};

    if (!values.identifikator) {
      errors.identifikator = 'Required';
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

  displayName: 'arbeidsgivere',
  enableReinitialize: true,
  isInitialValid: true,
})(NyArbeidsgiver);
