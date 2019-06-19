import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AlertStripe from 'nav-frontend-alertstriper';
import { Form, FieldArray } from 'formik';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Arbeidsgiver from '../Components/Arbeidsgiver';
import Maaned from '../Components/Maaned';
import TotalMaaned from '../Components/TotalMaaned';
import TotalInntekt from '../Components/TotalInntekt';
import Inntekt from './Inntekt';
import NyArbeidsgiver from './NyArbeidsgiver';
import { DisplayFormikState } from '../Utils/formikUtils';


// TODO fikse slik at vi ikke trenger å traverese dataen på nytt
export const buildCSSGrid = (inntekt, arbeidsgivere) => {
  const { arbeidsInntektMaaned } = inntekt;

  const maaneder = arbeidsInntektMaaned.sort((a, b) => b.aarMaaned.localeCompare(a.aarMaaned)).map((måned, index) => {
    if ((index + 1) % 12 === 0) {
      return `maaned--${måned.aarMaaned} maaned--total--${index}`;
    }
    return `maaned--${måned.aarMaaned}`;
  });
  const arbeidsgivereMedInntekter = arbeidsgivere.map((arbeidsgiver) => {
    const inntekter = arbeidsInntektMaaned.map((måned, index) => {
      if ((index + 1) % 12 === 0) {
        return `inntekter--${arbeidsgiver.identifikator}--${måned.aarMaaned} inntekter--${arbeidsgiver.identifikator}--total--${index}`;
      }
      return `inntekter--${arbeidsgiver.identifikator}--${måned.aarMaaned} `;
    });
    return `"arbeidsgiver--${arbeidsgiver.identifikator} ${inntekter.join(' ')}"`;
  });

  return `
  .grid {
    grid-template-areas: ". ${maaneder.join(' ')} " ${arbeidsgivereMedInntekter.join(' ')};
`;
};

export const Inntektstabell = (props) => {
  const {
    readOnly, status, isSubmitting, dirty, errors, values, hentInntektStatus,
  } = props;

  const [isArbeidsgiverModalOpen, setArbeidsgiverModal] = useState(false);
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


        {inntekt.arbeidsInntektMaaned.map((måned, index) => {
          const total = [];
          if ((index + 1) % 12 === 0) {
            // todo burde optimaliseres
            const siste12 = inntekt.arbeidsInntektMaaned.slice(index - 11, index + 1);
            siste12.forEach(info => info.arbeidsInntektInformasjon.inntektListe
              .map(liste => total.push({
                identifikator: `${liste.virksomhet.identifikator}`,
                total: Number(liste.beloep),
              })));
          }
          return (
            <React.Fragment key={måned.aarMaaned}>
              <Maaned maaned={måned.aarMaaned} />
              {(index + 1) % 12 === 0 && (
              <TotalMaaned index={index} />
              )}
              <>
                {arbeidsgivere.map(arbeidsgiver => (
                  <React.Fragment key={måned.aarMaaned + arbeidsgiver.identifikator}>
                    <Inntekt
                      readOnly={readOnly}
                      virksomhet={arbeidsgiver}
                      columnId={måned.aarMaaned}
                      // eslint-disable-next-line react/no-array-index-key
                      key={arbeidsgiver.identifikator + index}
                      inntekter={måned.arbeidsInntektInformasjon.inntektListe}
                      monthIndex={index}
                      formProps={props}
                    />
                    {(index + 1) % 12 === 0 && (
                    <TotalInntekt index={index} identifikator={arbeidsgiver.identifikator} total={total} />
                    )}
                  </React.Fragment>
                ))}
              </>

            </React.Fragment>

          );
        })}
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

        <div className="flexend">
          <Hovedknapp htmlType="submit" spinner={isSubmitting} autoDisableVedSpinner disabled={!hentInntektStatus && !dirty}>
      Bekreft
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
  hentInntektStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
};

Inntektstabell.defaultProps = {
  status: undefined,
};

export default Inntektstabell;
