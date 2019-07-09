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
import { ReactComponent as GodkjentIkon } from '../images/innvilget_valgt.svg';
import Spacer from '../Components/Spacer';


const mapVerdikoder = typer => typer
  .map(navn => (<option value={navn} key={navn}>{navn}</option>));

const visNavnOgIdentifikator = (virksomhet) => {
  const { navn, identifikator } = virksomhet;
  return `${navn} (${identifikator})`;
};

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
      <div className="okavbrytmodal">
        <div className="flex">
          <div className="flexcolumn">
            <div className="okavbrytmodal--ikon">
              <GodkjentIkon />
            </div>
          </div>
          <div className="flexcolumn okavbrytmodal--text">
            <Undertittel>
              {`Legg til ny inntektspost for ${visNavnOgIdentifikator(virksomhet)} i `}
              <DatoLabel dato={dato} datoFormat={MMMM_YYYY_FORMAT} />
            </Undertittel>
          </div>
        </div>
        <Spacer sixteenPx />
        <div className="w400">
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
        </div>
        <Spacer sixteenPx />

        <div className="flex knapprad flexend">
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
