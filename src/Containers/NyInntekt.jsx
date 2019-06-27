import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import InputField from '../Components/InputField';
import SelectField from '../Components/SelectField';
import { required } from '../Utils/validering';
import DatoLabel from '../Components/DatoLabel';
import { MMMM_YYYY_FORMAT } from '../Utils/datoFormat';
import { VerdikoderContext } from '../Context/Verdikoder';


const mapVerdikoder = typer => typer
  .map(navn => (<option value={navn} key={navn}>{navn}</option>));

const NyInntekt = (props) => {
  const {
    handleSubmit,
    isSubmitting,
    closeModal,
    virksomhet,
    isValid,
    dato,
  } = props;
  const verdikoder = useContext(VerdikoderContext);
  return (
    <Form onSubmit={handleSubmit}>
      <Undertittel>
        {`Legg til ny inntektspost for ${virksomhet.identifikator} i `}
        <DatoLabel dato={dato} datoFormat={MMMM_YYYY_FORMAT} />
      </Undertittel>

      <SelectField
        bredde="xl"
        label="Beskrivelse"
        selectValues={mapVerdikoder(verdikoder)}
        validate={required}
        name="verdikode"
        readOnly={false}
      />

      <InputField
        label="Beløp"
        name="beloep"
        validate={required}
        type="number"
        readOnly={false}
      />

      <div className="knapprad">
        <Hovedknapp
          htmlType="submit"
          onClick={handleSubmit}
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

    </Form>
  );
};

NyInntekt.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  virksomhet: PropTypes.shape().isRequired,
  dato: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
};

export default withFormik({
  mapPropsToValues: props => ({
    verdikode: '',
    beloep: '0.00',
    dato: props.dato,
    virksomhet: props.virksomhet,
    opplysningspliktig: props.opplysningspliktig,
  }),

  handleSubmit: (values, { setSubmitting, props }) => {
    const { closeModal, arrayHelpers } = props;
    arrayHelpers.push({
      verdikode: values.verdikode,
      beloep: values.beloep,
      utbetaltIMaaned: values.dato,
      fordel: 'denne kommer',
      inntektskilde: 'dagpenger-regel-ui',
      inntektsperiodetype: 'Maaned',
      virksomhet: values.virksomhet,
      inntektsmottaker: arrayHelpers.form.values.inntekt.ident,
      opplysningspliktig: values.virksomhet,

    });
    setSubmitting(false);
    closeModal();
  },

  displayName: 'nyInntekt',

})(NyInntekt);
