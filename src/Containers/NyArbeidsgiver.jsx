import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import InputField from '../Components/InputField';
import SelectField from '../Components/SelectField';
import { required, hasValidOrgNumber } from '../Utils/validering';

const aktoerType = [
  {
    navn: 'AktørId',
    kode: 'AKTOER_ID',
  },
  {
    navn: 'Naturlig ident',
    kode: 'NATURLIG_IDENT',
  },
  {
    navn: 'Organisasjon',
    kode: 'ORGANISASJON',
  },
];

const mapAktørType = typer => typer
  .map(({ navn, kode }) => (<option value={kode} key={kode}>{navn}</option>));

// todo lukke modal onsubmit
const NyArbeidsgiver = (props) => {
  const {
    handleSubmit,
    isSubmitting,
    closeModal,
    isValid,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Undertittel>
      Legg til ny arbeidsgiver
      </Undertittel>

      <InputField
        label="Org.Nr"
        name="identifikator"
        validate={hasValidOrgNumber}
        type="number"
      />

      <SelectField
        bredde="xl"
        label="Aktørtype"
        selectValues={mapAktørType(aktoerType)}
        validate={required}
        name="aktoerType"
      />

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
  mapPropsToValues: () => ({
    identifikator: undefined,
    navn: undefined,
    aktoerType: undefined,
  }),

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
