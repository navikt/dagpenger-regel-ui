import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AlertStripe from 'nav-frontend-alertstriper';
import { Form, FieldArray } from 'formik';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Arbeidsgiver from '../Components/Arbeidsgiver';
import Maaned from '../Components/Maaned';
import Inntekt from '../Components/Inntekt';
import NyArbeidsgiver from './NyArbeidsgiver';
import NyMaaned from './NyMaaned';
import { DisplayFormikState } from '../Utils/formikUtils';


// TODO fikse slik at vi ikke trenger å traverese dataen på nytt
export const buildCSSGrid = (inntekt, arbeidsgivere) => {
  const { arbeidsInntektMaaned } = inntekt;

  const maaneder = arbeidsInntektMaaned.sort((a, b) => a.aarMaaned.localeCompare(b.aarMaaned)).map(maaned => `maaned--${maaned.aarMaaned}`);
  const arbeidsgivereMedInntekter = arbeidsgivere.map((arbeidsgiver) => {
    const inntekter = arbeidsInntektMaaned.map(maaned => `inntekter--${arbeidsgiver.identifikator}--${maaned.aarMaaned} `);
    return `"arbeidsgiver--${arbeidsgiver.identifikator} ${inntekter.join(' ')}"`;
  });

  return `
  .grid {
    grid-template-areas: ". ${maaneder.join(' ')} " ${arbeidsgivereMedInntekter.join(' ')};
`;
};

export const Inntektstabell = (props) => {
  const {
    readOnly, status, isSubmitting, dirty, errors, values,
  } = props;

  const [isArbeidsgiverModalOpen, setArbeidsgiverModal] = useState(false);
  const [isMånedModalOpen, setMånedModal] = useState(false);
  const { arbeidsgivere, inntekt } = values;

  return (
    <Form>
      {status && status.success
  && <div aria-live="polite"><AlertStripe type="suksess">Inntekt er lagret</AlertStripe></div>}
      {status && status.failure
  && (
  <div aria-live="polite">
    <AlertStripe type="feil">Uff da. Noe feil skjedde under lagring av inntekt</AlertStripe>
  </div>
  )}

      <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: buildCSSGrid(inntekt, arbeidsgivere),
      }}
      />

      <div className="grid">
        {arbeidsgivere.length > 0 && arbeidsgivere.map(arbeidsgiver => (
          <Arbeidsgiver key={arbeidsgiver.identifikator} arbeidsgiver={arbeidsgiver} />
        ))}


        {inntekt.arbeidsInntektMaaned.map((maaned, monthIndex) => (
          <React.Fragment key={maaned.aarMaaned}>
            <Maaned maaned={maaned.aarMaaned} />
            <>
              {arbeidsgivere.map(arbeidsgiver => (
                <Inntekt
                  readOnly={readOnly}
                  virksomhet={arbeidsgiver}
                  columnId={maaned.aarMaaned}
                  key={arbeidsgiver.identifikator}
                  inntekter={maaned.arbeidsInntektInformasjon.inntektListe}
                  monthIndex={monthIndex}
                  formProps={props}
                />
              ))}
            </>
          </React.Fragment>

        ))}
      </div>
      {errors.name && <div className="error">{errors.name}</div>}

      <div className="flex knapprad">
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
        <div className="leggtilmaaned">
          <Knapp
            htmlType="button"
            mini
            disabled={readOnly}
            onClick={() => setMånedModal(!isMånedModalOpen)}
          >
Legg til måned

          </Knapp>
          <Modal
            isOpen={isMånedModalOpen}
            onRequestClose={() => setMånedModal(false)}
            closeButton={false}
            contentLabel="Ny arbeidsgiver"
            ariaHideApp={false}
          >
            <FieldArray
              name="inntekt.arbeidsInntektMaaned"
              render={arrayHelpers => (
                <NyMaaned closeModal={() => setMånedModal(false)} arrayHelpers={arrayHelpers} />
              )}
            />
          </Modal>
        </div>

        <div className="flexend">
          <Hovedknapp htmlType="submit" spinner={isSubmitting} autoDisableVedSpinner disabled={!dirty}>
      Bekreft og lagre
          </Hovedknapp>
        </div>
      </div>
      {process.env.NODE_ENV !== 'production' && (
        <DisplayFormikState {...values} />
      )}
    </Form>
  );
};

Inntektstabell.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  status: PropTypes.shape(),
  isSubmitting: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  errors: PropTypes.shape().isRequired,
  values: PropTypes.shape().isRequired,
};

Inntektstabell.defaultProps = {
  status: undefined,
};

export default Inntektstabell;
