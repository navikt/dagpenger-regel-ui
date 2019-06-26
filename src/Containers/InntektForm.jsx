import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik, FieldArray } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { shallowEqual } from 'recompose';
import { Element, Undertekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Spacer from '../Components/Spacer';
import { Inntektstabell } from './Inntektstabell';
import { lagreInntekt } from '../lib/inntektApiClient';
import NyArbeidsgiver from './NyArbeidsgiver';

const InntektForm = (props) => {
  const [isArbeidsgiverModalOpen, setArbeidsgiverModal] = useState(false);
  // const [isBekreftModalOpen, setBekreftModal] = useState(false);

  const {
    hentInntektStatus, values, dirty, readOnly, handleSubmit, status, errors, isSubmitting,
  } = props;

  const { arbeidsgivere } = values;
  return (
    <>
      {status && status.success && (
      <div aria-live="polite">
        <AlertStripe type="suksess">
          <Element>Inntekt er lagret.</Element>
Husk å beregn reglene på nytt i Arena slik at de inntektene du lagret nå blir med i beregningene.
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
              mini
              disabled={readOnly}
              onClick={() => setArbeidsgiverModal(!isArbeidsgiverModalOpen)}
            >
  Legg til arbeidsgiver
            </Knapp>
            <Modal
              isOpen={isArbeidsgiverModalOpen}
              onRequestClose={() => setArbeidsgiverModal(false)}
              closeButton={false}
              contentLabel="Ny arbeidsgiver"
              ariaHideApp={false}
            >
              <FieldArray
                name="arbeidsgivere"
                render={arrayHelpers => (
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
            <div className="w200 marginvhoyre16"><Undertekst>Du må bekrefte at de nye opplysningene skal benyttes</Undertekst></div>

            <Hovedknapp
              htmlType="submit"
              onClick={handleSubmit}
              spinner={isSubmitting}
              autoDisableVedSpinner
              disabled={!hentInntektStatus && !dirty}
            >
              Bekreft
            </Hovedknapp>

          </div>
        </div>

      </Form>

    </>
  );
};

InntektForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.shape().isRequired,
  locationData: PropTypes.shape().isRequired,
  dirty: PropTypes.bool.isRequired,
  values: PropTypes.shape().isRequired,
  hentInntektStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  status: PropTypes.shape(),
};

InntektForm.defaultProps = {
  status: undefined,
};

export default withFormik({
  mapPropsToValues: (props) => {
    const {
      initialValues,
    } = props;
    return (initialValues);
  },


  handleSubmit: (values, formProps) => {
    const dirty = !shallowEqual(formProps.props.initialValues, values);
    setTimeout(() => {
      lagreInntekt(
        { ...values, redigertAvSaksbehandler: dirty || values.manueltRedigert },
        formProps.props.hentInntektStatus,
        formProps.props.locationData,
      )
        .then((result) => {
          // setInntektdata({ ...result.data });
          // setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
          formProps.setStatus({ success: true });
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          formProps.setStatus({ failure: true });
        }).finally(() => {
          formProps.setSubmitting(false);
        });
    }, 1000);
  },

  validate: true,
  displayName: 'InntektForm',
  enableReinitialize: true,

})(InntektForm);
