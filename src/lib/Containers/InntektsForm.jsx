import React, { useState } from "react";
import PropTypes from "prop-types";
import { FieldArray, Form, withFormik } from "formik";
import AlertStripe from "nav-frontend-alertstriper";
import { isEqual } from "lodash";
import { Element, Undertekst } from "nav-frontend-typografi";
import Modal from "nav-frontend-modal";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import Spacer from "../Components/Spacer";
import { Inntektstabell } from "./Inntektstabell";
import { lagreInntekt } from "../inntektApiClient";
import NyArbeidsgiver from "./NyArbeidsgiver";
import OkAvbrytModal from "../Components/OkAvbrytModal";

function InntektsForm(props) {
  const [isArbeidsgiverModalOpen, setArbeidsgiverModal] = useState(false);
  const [isBekreftModalOpen, setBekreftModal] = useState(false);

  const {
    hentInntektStatus,
    values,
    dirty,
    readOnly,
    handleSubmit,
    status,
    errors,
    isSubmitting,
  } = props;

  const { arbeidsgivere } = values;

  const bekreftManuellEndring = () => {
    if (values.redigertAvSaksbehandler || dirty) {
      setBekreftModal(true);
    }
  };

  return (
    <>
      {status && status.success && (
        <div aria-live="polite">
          <AlertStripe type="suksess">
            <Element>Inntekt er lagret.</Element>
            Husk å beregn reglene på nytt i Arena slik at de inntektene du
            lagret nå blir med i beregningene.
          </AlertStripe>
          <Spacer sixteenPx />
        </div>
      )}
      <Form onSubmit={handleSubmit}>
        <Inntektstabell
          {...props}
          readOnly={readOnly}
          hentInntektStatus={hentInntektStatus}
        />
        {errors.name && <div className="error">{errors.name}</div>}

        <div className="toolbar flex knapprad">
          <div className="leggtilarbeidsgiver">
            <Knapp
              htmlType="button"
              disabled={readOnly}
              onClick={() => setArbeidsgiverModal(!isArbeidsgiverModalOpen)}
            >
              Legg til arbeidsgiver
            </Knapp>
            <Modal
              isOpen={isArbeidsgiverModalOpen}
              onRequestClose={() => setArbeidsgiverModal(false)}
              closeButton={false}
              contentLabel="Legg til arbeidsgiver"
              ariaHideApp={false}
            >
              <FieldArray
                name="arbeidsgivere"
                render={(arrayHelpers) => (
                  <NyArbeidsgiver
                    arbeidsgivere={arbeidsgivere}
                    arrayHelpers={arrayHelpers}
                    closeModal={() => setArbeidsgiverModal(false)}
                  />
                )}
              />
            </Modal>
          </div>

          <div className="flexend flex">
            <div className="w200 marginhoyre16">
              <Undertekst>
                Du må bekrefte at de nye opplysningene skal benyttes.
              </Undertekst>
            </div>
            <Hovedknapp
              htmlType="button"
              onClick={bekreftManuellEndring}
              spinner={isSubmitting}
              autoDisableVedSpinner
              disabled={!hentInntektStatus && !dirty}
            >
              Bekreft
            </Hovedknapp>
            <OkAvbrytModal
              isOpen={isBekreftModalOpen}
              text="Når du bekrefter ny inntekt så vil alle tidligere endringene overskrives."
              avbrytCallback={() => setBekreftModal(false)}
              OkCallback={() => {
                handleSubmit();
                setBekreftModal(false);
              }}
            />
          </div>
        </div>
      </Form>
    </>
  );
}

InntektsForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.shape().isRequired,
  locationData: PropTypes.shape().isRequired,
  isValid: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  values: PropTypes.shape().isRequired,
  hentInntektStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    .isRequired,
  status: PropTypes.shape(),
};

InntektsForm.defaultProps = {
  status: undefined,
};

export default withFormik({
  mapPropsToValues: (props) => {
    const { initialValues } = props;
    return initialValues;
  },

  // todo bare endre til async fra promise
  handleSubmit: (values, formProps) => {
    const dirty = !isEqual(formProps.props.initialValues, values);

    setTimeout(() => {
      lagreInntekt(
        { ...values, redigertAvSaksbehandler: dirty || values.manueltRedigert },
        formProps.props.hentInntektStatus,
        formProps.props.locationData
      )
        .then(() => {
          // trenger jo ikke sette dataene på nytt
          // setInntektdata({ ...result.data });
          // setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
          formProps.setStatus({ success: true });
          formProps.setSubmitting(false);
        })
        .catch((error) => {
          formProps.setStatus({ failure: true });
          formProps.setError(error);
        });
    }, 1000);
  },

  displayName: "InntektsForm",
  enableReinitialize: true,
})(InntektsForm);
