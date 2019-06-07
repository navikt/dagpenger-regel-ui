import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import InputField from '../Components/InputField';
import SelectField from '../Components/SelectField';
import { required } from '../Utils/validering';
import DatoLabel from '../Components/DatoLabel';
import { MMMM_YYYY_FORMAT } from '../Utils/datoFormat';

// to lage en compontent for dette
import { inntektTyper } from '../Kodeverk/verdikoder';

const mapTypeInntekter = typer => typer
  .map(navn => (<option value={navn} key={navn}>{navn}</option>));

// todo lukke modal onsubmit
const NyInntekt = (props) => {
  const {
    handleSubmit,
    isSubmitting,
    closeModal,
    arbeidsgiver,
    dato,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Undertittel>
        {`Legg til ny inntektspost for ${arbeidsgiver} i `}
        <DatoLabel dato={dato} datoFormat={MMMM_YYYY_FORMAT} />
      </Undertittel>

      <SelectField
        bredde="xl"
        label="Beskrivelse"
        selectValues={mapTypeInntekter(inntektTyper)}
        validate={[required]}
        name="verdikode"
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

NyInntekt.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  arbeidsgiver: PropTypes.string.isRequired,
  dato: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default withFormik({
  mapPropsToValues: () => ({
    verdikode: '',
    beloep: '0.00',
  }),
  // Custom sync validation
  validate: (values) => {
    const errors = {};

    if (!values.verdikode) {
      errors.verdikode = 'Required';
    }

    return errors;
  },

  handleSubmit: (values, { setSubmitting, props }) => {
    const { arbeidsgiver, closeModal, arrayHelpers } = props;
    arrayHelpers.insert(0, {
      verdikode: values.verdikode,
      beloep: values.beloep,
      virksomhet: {
        aktoerType: 'ORGANISASJON',
        identifikator: arbeidsgiver,
        navn: 'Enenenenen',
      },
    });
    setSubmitting(false);
    closeModal();
  },

  displayName: 'nyInntekt',

})(NyInntekt);
