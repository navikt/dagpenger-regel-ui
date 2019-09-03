import React from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik } from 'formik';
import { useQuery } from '@apollo/react-hooks';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import { loader } from 'graphql.macro';
import aktørTyper from '../Kodeverk/aktoerTyper';
import { InputField, RadioGroupField, RadioOption } from '../Form';
import Spacer from '../Components/Spacer';

import { required, hasValidOrgNumber, hasValidFodselsnummer } from '../Utils/validering';
import { ReactComponent as GodkjentIkon } from '../images/innvilget_valgt.svg';

const GET_AKTOER = loader('./GET_AKTOER.gql');

// todo fikse stringifyvalues
const NyArbeidsgiver = ({ handleSubmit, isSubmitting, closeModal, isValid, values }) => {
  const { data } = useQuery(GET_AKTOER, {
    skip: !isValid,
    variables: {
      aktoerId: values.identifikator,
      aktoerType: values.aktoerType ? values.aktoerType.toUpperCase() : null,
    },
  });

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
            <Undertittel>Legg til ny arbeidsgiver</Undertittel>
          </div>
        </div>
        <Spacer sixteenPx />

        <div className="w400">
          <RadioGroupField label="Type aktør?" name="aktoerType" validate={required}>
            <RadioOption value={aktørTyper.ORGANISASJON} label="Virksomhet" />
            <RadioOption value={aktørTyper.AKTOER_ID} label="Privatperson" />
          </RadioGroupField>
          {values.aktoerType === aktørTyper.ORGANISASJON && <InputField label="Org.Nr" name="identifikator" validate={hasValidOrgNumber} />}

          {values.aktoerType === aktørTyper.AKTOER_ID && <InputField label="Fødselsnummer" name="identifikator" validate={hasValidFodselsnummer} />}
          {data && data.aktoer && data.aktoer.navn && <InputField label="" name="navn" readOnly value={data.aktoer.navn} />}
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

NyArbeidsgiver.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  values: PropTypes.shape().isRequired,
};

export default withFormik({
  mapPropsToValues: () => ({
    identifikator: undefined,
    aktoerType: undefined,
    navn: undefined,
  }),

  validate: (values, props) => {
    const errors = {};

    // todo sikre at det ikke blir NP
    if (props.person.vedtak.inntekt.posteringer.some(arbeidsgiver => arbeidsgiver.identifikator === values.identifikator)) {
      errors.identifikator = 'Arbeidsgiver eksisterer allerede';
    }
    return errors;
  },

  handleSubmit: (values, { setSubmitting, props }) => {
    const { arrayHelpers, closeModal } = props;
    console.log(values);
    arrayHelpers.push({
      navn: values.navn,
      organisasjonsnummer: values.identifikator,
      naturligIdent: values.identifikator,
      identifikator: values.identifikator,
      __typename: values.aktoerType,
      posteringer: {},
    });
    setSubmitting(false);
    closeModal();
  },

  displayName: 'NyArbeidsgiverForm',
})(NyArbeidsgiver);
