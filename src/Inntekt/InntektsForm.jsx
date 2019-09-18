import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFormik, FieldArray } from 'formik';
import isEqual from 'lodash.isequal';
import { ToggleGruppe } from 'nav-frontend-toggle';
// import { useMutation } from '@apollo/react-hooks';
// import { loader } from 'graphql.macro';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element, Undertekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import DisplayFormikState from '../Utils/formikUtils';
import Spacer from '../Components/Spacer';
import Inntekt from './Inntekt';
import Arbeidsgiver from '../Arbeidsgiver/Arbeidsgiver';
import NyArbeidsgiver from '../Arbeidsgiver/NyArbeidsgiver';
import OkAvbrytModal from '../Components/OkAvbrytModal';
import DatoLabel from '../Components/DatoLabel';
import { MMMM_YYYY_FORMAT } from '../Utils/datoFormat';
import { lagreInntekt } from '../lib/inntektApi';

const scrollToRef = ref => {
  ref.current.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'end',
  });
};

/*
const ADD_INNTEKT = loader('../Graphql/ADD_INNTEKT.gql');
const DELETE_INNTEKT = loader('../Graphql/DELETE_INNTEKT.gql');
const UPDATE_INNTEKT = loader('../Graphql/UPDATE_INNTEKT.gql');
*/

const InntektsForm = props => {
  // const [inntektMutation] = useMutation(ADD_INNTEKT);
  const [isArbeidsgiverModalOpen, setArbeidsgiverModal] = useState(false);
  const [isBekreftModalOpen, setBekreftModal] = useState(false);
  const { hentInntektStatus, måneder, values, isValid, dirty, readOnly, handleSubmit, status, errors, isSubmitting } = props;

  const { person } = values;

  const bekreftManuellEndring = isRedigertAvSaksbehandler => {
    if (isRedigertAvSaksbehandler) {
      return setBekreftModal(true);
    }

    return handleSubmit();
  };

  /*
  const handleMutation = async () => {
    const result = await inntektMutation();

    return result;
  };

  */

  const tdRefs = {};
  const executeScroll = index => scrollToRef(tdRefs[index]);

  // Bare kjør en gang på onload
  if (!dirty) {
    window.setTimeout(() => {
      const elem = document.getElementById('grid');
      if (elem) {
        elem.scrollLeft = elem.scrollWidth;
      }
    }, 1);
  }

  return (
    <>
      {errors.name && <div className="error">{errors.name}</div>}
      <div className="flex">
        <div className="flexend">
          <p>Totalt per 12 måneder</p>
          <ToggleGruppe
            minstEn
            kompakt
            defaultToggles={[
              { children: '0. år', value: 0 },
              { children: '1. år', value: 11 },
              { children: '2. år', value: 23 },
              { children: '3. år', value: 35, pressed: true },
            ]}
            onChange={(event, toggles) => executeScroll(toggles.filter(toggle => toggle.pressed)[0].value)}
          />
          <Spacer sixteenPx />
        </div>
      </div>

      {status && status.success && (
        <div aria-live="polite">
          <AlertStripe type="suksess">
            <Element>Inntekt er lagret.</Element>
            Husk å beregn reglene på nytt i Arena slik at de inntektene du lagret nå blir med i beregningene.
          </AlertStripe>
          <Spacer sixteenPx />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <div className="grid" id="grid">
            <div className="inntektstabell">
              <div className="row noprint">
                <div className="item" />
                {måneder &&
                  måneder.map((måned, index) => {
                    tdRefs[index] = React.createRef();
                    return (
                      <React.Fragment key={måned}>
                        <div className="item maaned" ref={tdRefs[index]}>
                          <DatoLabel dato={måned} datoFormat={MMMM_YYYY_FORMAT} />
                        </div>
                        {(index + 1) % 12 === 0 && (
                          <div className="item maaned" ref={tdRefs[index]}>
                            Totalt
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
              </div>
              {person.vedtak.inntekt.posteringer &&
                person.vedtak.inntekt.posteringer.map((arbeidsgiver, arbeidsgiverIndex) => {
                  const key = arbeidsgiver.organisasjonsnummer || arbeidsgiver.naturligIdent;
                  return (
                    <div className="row" key={key}>
                      <Arbeidsgiver readOnly={readOnly} arbeidsgiver={arbeidsgiver} />
                      <Inntekt readOnly={readOnly} arbeidsgiver={arbeidsgiver} arbeidsgiverIndex={arbeidsgiverIndex} />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="toolbar flex knapprad">
            <div className="leggtilarbeidsgiver">
              <Knapp htmlType="button" disabled={readOnly} onClick={() => setArbeidsgiverModal(!isArbeidsgiverModalOpen)}>
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
                  name="person.vedtak.inntekt.posteringer"
                  initialValues={{}}
                  render={arrayHelpers => (
                    <NyArbeidsgiver person={person} måneder={måneder} arrayHelpers={arrayHelpers} closeModal={() => setArbeidsgiverModal(false)} />
                  )}
                />
              </Modal>
            </div>
            <div className="flexend flex">
              <div className="w200 marginhoyre16">
                <Undertekst>Du må bekrefte at de nye opplysningene skal benyttes.</Undertekst>
              </div>
              <Hovedknapp
                htmlType="button"
                onClick={() => bekreftManuellEndring(values.person.vedtak.inntekt.redigertAvSaksbehandler)}
                spinner={isSubmitting}
                autoDisableVedSpinner
                disabled={(!hentInntektStatus && !dirty) || !isValid}
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
        </div>
        <div className="noprint">
          <DisplayFormikState {...values} />
        </div>
      </form>
    </>
  );
};

InntektsForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.shape().isRequired,
  isValid: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  values: PropTypes.shape().isRequired,
  hentInntektStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  status: PropTypes.shape(),
  måneder: PropTypes.arrayOf(PropTypes.string).isRequired,
};
InntektsForm.defaultProps = {
  status: undefined,
};

export default withFormik({
  mapPropsToValues: props => {
    const { initialValues } = props;
    return initialValues;
  },

  validationSchema: () => {},

  handleSubmit: async (values, formProps) => {
    const dirty = !isEqual(formProps.props.initialValues, values);

    // TODO ønsker å bruke mutation, men backend har ikke støtte for dette ennå. Så må sende inn som inntekt
    const posteringer = values.person.vedtak.inntekt.posteringer.flatMap(virksomhet =>
      Object.keys(virksomhet.posteringer).flatMap(dato => virksomhet.posteringer[dato]),
    );

    const groupBy = list => {
      const map = new Map();
      list.forEach(a => {
        const samme = list.filter(b => a.aarMaaned === b.aarMaaned);
        map.set(a.aarMaaned, {
          aarMaaned: a.aarMaaned,
          arbeidsInntektInformasjon: {
            inntektListe: [...samme],
          },
        });
      });
      return Array.from(map.values());
    };

    const gruppertePosteringer = groupBy(posteringer);

    const inntekt = {
      inntektId: {
        id: values.person.vedtak.inntekt.id,
      },
      inntekt: {
        arbeidsInntektMaaned: [...gruppertePosteringer],
        fraDato: values.person.vedtak.inntekt.fraDato,
        ident: {
          aktoerType: 'AKTOER_ID',
          identifikator: values.person.aktoerId,
        },
        tilDato: values.person.vedtak.inntekt.tilDato,
      },
      inntektsmottaker: {
        pnr: values.person.naturligIdent,
        navn: values.person.navn,
      },
      redigertAvSaksbehandler: values.person.vedtak.inntekt.redigertAvSaksbehandler,
      manueltRedigert: values.person.vedtak.inntekt.manueltRedigert,
      timestamp: values.person.vedtak.inntekt.timestamp,
    };
    try {
      // transform values, brukt GET values
      const response = await lagreInntekt(
        { ...inntekt, redigertAvSaksbehandler: dirty || values.manueltRedigert },
        formProps.props.hentInntektStatus,
        formProps.props.locationData,
      );

      if (response.status === 200) {
        formProps.setStatus({ success: true });
        formProps.setSubmitting(false);
      } else {
        formProps.setStatus({ success: false, error: response.message });
        formProps.setSubmitting(false);
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  displayName: 'InntektsForm',
  enableReinitialize: true,
})(InntektsForm);
