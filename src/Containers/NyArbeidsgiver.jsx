import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import InputField from '../Components/InputField';
import SelectField from '../Components/SelectField';
import { required, hasValidOrgNumber } from '../Utils/validering';
import { DisplayFormikState } from '../Utils/formikUtils';

import { aktoerType } from '../Kodeverk/verdikoder';

const mapTypeInntekter = typer => typer
  .map(navn => (<option value={navn} key={navn}>{navn}</option>));

// todo lukke modal onsubmit
const NyArbeidsgiver = ({
  closeModal, values, handleSubmit,
}) => (
  <>
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

    <DisplayFormikState {...values} />

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
  </>
);

NyArbeidsgiver.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  values: PropTypes.shape().isRequired,
};

export default withFormik({
  mapPropsToValues: ({ setArbeidsgivere, arbeidsgivere, closeModal }) => ({
    identifikator: null,
    navn: null,
    aktoerType: null,
    setArbeidsgivere,
    arbeidsgivere,
    closeModal,
  }),

  // Custom sync validation
  validate: (values) => {
    const errors = {};

    if (!values.identifikator) {
      errors.identifikator = 'Required';
    }

    return errors;
  },

  handleSubmit: (values, { setSubmitting }) => {
    values.setArbeidsgivere([
      ...values.arbeidsgivere,
      {
        identifikator: values.identifikator,
        navn: values.navn,
        aktoerType: values.aktoerType,
      },
    ]);
    setSubmitting(false);
    values.closeModal();
  },
  displayName: 'NyArbeidsgiver',
  enableReinitialize: true,
  isInitialValid: true,
})(NyArbeidsgiver);
