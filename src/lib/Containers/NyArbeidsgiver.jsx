import React from "react";
import PropTypes from "prop-types";
import { Form, withFormik } from "formik";
import { Undertittel } from "nav-frontend-typografi";
import InputField from "../Components/InputField";
import aktørTyper from "../Kodeverk/aktoerTyper";
import { RadioGroupField } from "../Components/RadioGroupField";
import { RadioOption } from "../Components/RadioOption";
import Spacer from "../Components/Spacer";
import { hasValidFodselsnummer, hasValidOrgNumber, required } from "../Utils/validering";
import GodkjentIkon from "../../assets/svg/innvilget_valgt.svg";
import { Button } from "@navikt/ds-react";

// totalen kan ikke være mindre enn 0

// todo fikse stringifyvalues
function NyArbeidsgiver({ handleSubmit, isSubmitting, closeModal, isValid, values }) {
  return (
    <Form onSubmit={handleSubmit}>
      <div className="okavbrytmodal">
        <div className="flex">
          <div className="flexcolumn">
            <div className="okavbrytmodal--ikon">
              <img src={GodkjentIkon} alt="" />
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
          {values.aktoerType === aktørTyper.ORGANISASJON && (
            <InputField label="Org.Nr" name="identifikator" validate={hasValidOrgNumber} />
          )}

          {values.aktoerType === aktørTyper.AKTOER_ID && (
            <InputField
              label="Fødselsnummer"
              name="identifikator"
              validate={hasValidFodselsnummer}
            />
          )}
        </div>
        <Spacer sixteenPx />
        <div className="knapprad ">
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            Legg til
          </Button>
          <Button variant="secondary" type="button" onClick={closeModal}>
            Avbryt
          </Button>
        </div>
      </div>
    </Form>
  );
}

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
    navn: undefined,
    aktoerType: undefined,
  }),

  validate: (values, props) => {
    const errors = {};
    if (
      props.arbeidsgivere.some(
        (arbeidsgiver) => arbeidsgiver.identifikator === values.identifikator
      )
    ) {
      errors.identifikator = "Arbeidsgiver eksisterer allerede";
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

  displayName: "NyArbeidsgiverForm",
})(NyArbeidsgiver);
