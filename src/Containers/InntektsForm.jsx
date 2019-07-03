import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik, FieldArray } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import isEqual from 'lodash.isequal';
import { Element, Undertekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Spacer from '../Components/Spacer';
import { Inntektstabell } from './Inntektstabell';
import { lagreInntekt } from '../lib/inntektApiClient';
import NyArbeidsgiver from './NyArbeidsgiver';
import OkAvbrytModal from '../Components/OkAvbrytModal';
import { LocaleContext } from '../Context/Locale';

const InntektsForm = (props) => {
  const [isArbeidsgiverModalOpen, setArbeidsgiverModal] = useState(false);
  const [isBekreftModalOpen, setBekreftModal] = useState(false);
  const locale = useContext(LocaleContext);

  const {
    hentInntektStatus, values, dirty, readOnly, handleSubmit, status, errors, isSubmitting,
  } = props;

  const { arbeidsgivere } = values;
  return (
    <>
      {status && status.success && (
      <div aria-live="polite">
        <AlertStripe type="suksess">
          <Element>{locale.inntektLagret}</Element>
          {locale.inntektLagretHuskÅBeregneIArena}
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
              contentLabel="Legg til arbeidsgiver"
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
            <div className="w200 marginhoyre16"><Undertekst>Du må bekrefte at de nye opplysningene skal benyttes.</Undertekst></div>
            {values.redigertAvSaksbehandler && (
            <Hovedknapp
              htmlType="button"
              onClick={() => setBekreftModal(true)}
              spinner={isSubmitting}
              autoDisableVedSpinner
              disabled={!hentInntektStatus && !dirty}
            >
              Bekreft
            </Hovedknapp>
            )}
            {!values.redigertAvSaksbehandler && (
            <Hovedknapp
              htmlType="submit"
              onClick={handleSubmit}
              spinner={isSubmitting}
              autoDisableVedSpinner
              disabled={!hentInntektStatus && !dirty}
            >
              Bekreft
            </Hovedknapp>
            )}
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
};

InntektsForm.propTypes = {
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

InntektsForm.defaultProps = {
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
    const dirty = !isEqual(formProps.props.initialValues, values);

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
          formProps.setSubmitting(false);
        })
        .catch((error) => {
          formProps.setStatus({ failure: true });
          formProps.setError(error);
        });
    }, 1000);
  },

  validate: true,
  displayName: 'InntektsForm',
  enableReinitialize: true,

})(InntektsForm);
