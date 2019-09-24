import React from 'react';
import PropTypes from 'prop-types';
import { withFormik, Field } from 'formik';
import { useQuery } from '@apollo/react-hooks';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import { loader } from 'graphql.macro';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import * as Yup from 'yup';
import aktørTyper from '../Kodeverk/aktoerTyper';
import Spacer from '../Components/Spacer';
import { InputField } from '../Form';
import { hasValidFodselsnummer } from '../Utils/validering';
import { ReactComponent as GodkjentIkon } from '../images/innvilget_valgt.svg';

const GET_AKTOER = loader('../Graphql/GET_AKTOER.gql');

const NyArbeidsgiver = ({ handleSubmit, isSubmitting, closeModal, isValid, values, setFieldValue }) => {
  const { data } = useQuery(GET_AKTOER, {
    skip: !isValid && values.identifikator !== '' && values.aktoerType !== '',
    variables: {
      aktoerId: values.identifikator,
      aktoerType: values.aktoerType ? values.aktoerType.toUpperCase() : null,
    },
  });

  const setNavn = () => {
    if (data && data.aktoer && data.aktoer.navn) {
      setFieldValue('navn', data.aktoer.navn);
    }
  };

  const onChange = value => {
    setFieldValue('aktoerType', value);
  };

  return (
    <form onSubmit={handleSubmit}>
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
          <Field
            component={RadioPanelGruppe}
            label="Type aktør?"
            name="aktoerType"
            legend="Type aktør?"
            radios={[
              { name: 'aktoerType', label: 'Virksomhet', value: aktørTyper.ORGANISASJON, id: aktørTyper.ORGANISASJON },
              { name: 'aktoerType', label: 'Privatperson', value: aktørTyper.AKTOER_ID, id: aktørTyper.AKTOER_ID },
            ]}
            onChange={(event, value) => onChange(value)}
            checked={values.aktoerType}
          />
          {values.aktoerType === aktørTyper.ORGANISASJON && (
            <Field component={InputField} label="Organisasjonsnummer" name="identifikator" onBlur={() => setNavn()} />
          )}

          {values.aktoerType === aktørTyper.AKTOER_ID && <Field component={InputField} label="Fødselsnummer" name="identifikator" onBlur={() => setNavn()} />}
          <Field component={InputField} label="Navn" name="navn" disabled />
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
    </form>
  );
};

NyArbeidsgiver.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  values: PropTypes.shape().isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default withFormik({
  mapPropsToValues: () => {
    return {
      aktoerId: null,
      navn: null,
      identifikator: null,
    };
  },

  validationSchema: props => {
    return Yup.lazy(values => {
      let identifikatorSchema;
      if (values.aktoerType === aktørTyper.ORGANISASJON) {
        identifikatorSchema = Yup.string()
          .required('Required')
          .test(() => props.person.vedtak.inntekt.posteringer.some(arbeidsgiver => arbeidsgiver.identifikator !== values.identifikator))
          .length(9);
      } else {
        identifikatorSchema = Yup.string()
          .required('Required')
          .test(() => hasValidFodselsnummer(values.identifikator));
      }
      return Yup.object().shape({
        identifikator: identifikatorSchema,
        aktoerType: Yup.string().required('Required'),
      });
    });
  },

  handleSubmit: (values, { setSubmitting, props }) => {
    const { arrayHelpers, closeModal } = props;
    const datoer = {};
    props.måneder.forEach(element => {
      Object.assign(datoer, { [element]: [] });
    });

    arrayHelpers.push({
      navn: values.navn,
      organisasjonsnummer: values.identifikator,
      naturligIdent: values.identifikator,
      identifikator: values.identifikator,
      __typename: values.aktoerType,
      posteringer: datoer,
    });
    setSubmitting(false);
    closeModal();
  },
  enableReinitialize: true,
  displayName: 'NyArbeidsgiverForm',
})(NyArbeidsgiver);
