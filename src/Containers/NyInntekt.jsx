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
const NyInntekt = ({
  arbeidsgiver, dato, closeModal, handleSubmit,
}) => (
  <React.Fragment key={`${arbeidsgiver} ${dato}`}>
    <Undertittel>
      {`Legg til ny inntektspost for ${arbeidsgiver} i `}
      <DatoLabel dato={dato} datoFormat={MMMM_YYYY_FORMAT} />
    </Undertittel>

    <SelectField
      bredde="xl"
      label="verdikode"
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
  handleSubmit: PropTypes.func.isRequired,
  arbeidsgiver: PropTypes.string.isRequired,
  dato: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  values: PropTypes.shape().isRequired,
};

export default withFormik({
  mapPropsToValues: ({
    arrayHelpers, arbeidsgiver, closeModal,
  }) => ({
    verdikode: '',
    beloep: '0.00',
    closeModal,
    arbeidsgiver,
    arrayHelpers,
  }),
  // Custom sync validation
  validate: (values) => {
    const errors = {};

    if (!values.verdikode) {
      errors.verdikode = 'Required';
    }

    return errors;
  },

  handleSubmit: (values, { setSubmitting }) => {
    const { arrayHelpers, closeModal } = values;
    arrayHelpers.insert(0, {
      verdikode: values.verdikode,
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
