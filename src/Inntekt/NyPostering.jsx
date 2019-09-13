import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik, Field } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import * as Yup from 'yup';
import { InputField, SelectField } from '../Form';
import DatoLabel from '../Components/DatoLabel';
import { MMMM_YYYY_FORMAT } from '../Utils/datoFormat';
import { VerdikoderContext } from '../Context/Verdikoder';
import { ReactComponent as GodkjentIkon } from '../images/innvilget_valgt.svg';
import Spacer from '../Components/Spacer';

const mapVerdikoder = typer =>
  typer.map(({ navn }) => (
    <option value={navn} key={navn}>
      {navn}
    </option>
  ));

const visNavnOgIdentifikator = virksomhet => {
  const { navn, identifikator } = virksomhet;
  return `${navn} (${identifikator})`;
};

const NyPostering = props => {
  const { handleSubmit, isSubmitting, closeModal, values, isValid, dato } = props;
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
              {`Legg til ny inntektspost for ${visNavnOgIdentifikator(values.virksomhet)} i `}
              <DatoLabel dato={dato} datoFormat={MMMM_YYYY_FORMAT} />
            </Undertittel>
          </div>
        </div>
        <Spacer sixteenPx />
        <div className="w400">
          <Field component={SelectField} bredde="xl" label="Beskrivelse" name="verdikode">
            {mapVerdikoder(verdikoder)}
          </Field>

          <Field component={InputField} label="Beløp" name="beloep" type="number" />
        </div>
        <Spacer sixteenPx />

        <div className="flex knapprad flexend">
          <Hovedknapp htmlType="submit" onClick={handleSubmit} disabled={!isValid || isSubmitting}>
            Legg til
          </Hovedknapp>
          <Knapp htmlType="button" onClick={closeModal}>
            Avbryt
          </Knapp>
        </div>
      </div>
    </Form>
  );
};

NyPostering.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.shape().isRequired,
  dato: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
};

export default withFormik({
  mapPropsToValues: ({ arbeidsgiver, dato }) => {
    return {
      fordel: '',
      beloep: '0.00',
      dato,
      virksomhet: {
        navn: arbeidsgiver.navn,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
      },
      opplysningspliktig: {
        navn: arbeidsgiver.navn,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
      },
    };
  },

  validationSchema: Yup.object().shape({
    beloep: Yup.number().required('Required'),
    verdikode: Yup.string().required('Required'),
  }),

  handleSubmit: (values, { setSubmitting, props }) => {
    const { closeModal, arrayHelpers } = props;
    arrayHelpers.push({
      fordel: values.fordel,
      beloep: values.beloep,
      utbetaltIMaaned: values.dato,
      verdikode: 'denne kommer',
      inntektskilde: 'dagpenger-regel-ui',
      inntektsperiodetype: 'Maaned',
      virksomhet: values.virksomhet,
      inntektsmottaker: arrayHelpers.form.values.person.identifikator,
      opplysningspliktig: values.virksomhet,
    });
    setSubmitting(false);
    closeModal();
  },

  displayName: 'NyPostering',
})(NyPostering);
