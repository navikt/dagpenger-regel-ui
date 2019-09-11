import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFormik, FieldArray } from 'formik';
import isEqual from 'lodash.isequal';
// import { useMutation } from '@apollo/react-hooks';
// import { loader } from 'graphql.macro';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element, Undertekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp, Flatknapp } from 'nav-frontend-knapper';
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
  const elem = document.getElementById('grid');
  elem.scrollTo({
    top: 0,
    left: ref.current.offsetLeft - 250, // 250 is the width of 1 cell
    behavior: 'smooth',
  });
};

/*
const ADD_INNTEKT = loader('./ADD_INNTEKT.gql');
const DELETE_INNTEKT = loader('./DELETE_INNTEKT.gql');
const UPDATE_INNTEKT = loader('./UPDATE_INNTEKT.gql');
*/

const InntektsForm = props => {
  // const [inntektMutation] = useMutation(ADD_INNTEKT);
  const [isArbeidsgiverModalOpen, setArbeidsgiverModal] = useState(false);
  const [isBekreftModalOpen, setBekreftModal] = useState(false);

  const { hentInntektStatus, måneder, values, isValid, dirty, readOnly, handleSubmit, status, errors, isSubmitting } = props;

  const { person } = values;

  const bekreftManuellEndring = () => {
    if (values.redigertAvSaksbehandler) {
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

  // Bare kjør onLoad
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
      <div className="flex hentinntekter">
        <div className="flexend">
          <Flatknapp mini htmlType="button" onClick={() => executeScroll(0)}>
            {'<<'}
          </Flatknapp>
          <Flatknapp mini htmlType="button" onClick={() => executeScroll(35)}>
            {'>>'}
          </Flatknapp>
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
                onClick={bekreftManuellEndring}
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
  handleSubmit: (values, formProps) => {
    // console.log(values, formProps);
    const dirty = !isEqual(formProps.props.initialValues, values);

    // TODO ønsker å bruke mutation, men backend har ikke støtte for dette ennå. Så må sende inn som inntekt
    const posteringer = values.person.vedtak.inntekt.posteringer.flatMap(virksomhet =>
      Object.keys(virksomhet.posteringer).flatMap(dato => virksomhet.posteringer[dato]),
    );

    // todo fiks navn
    const groupBy = list => {
      const c = new Map();
      list.forEach(a => {
        const samme = list.filter(b => a.aarMaaned === b.aarMaaned);
        c.set(a.aarMaaned, {
          aarMaaned: a.aarMaaned,
          arbeidsInntektInformasjon: {
            inntektListe: [...samme],
          },
        });
      });
      return Array.from(c.values());
    };

    const g = groupBy(posteringer);

    if (dirty) {
      // mutate posteringer, slettet, nye og endrede
      return true;
    }
    try {
      // transform values, brukt GET values
      const inntekt = {
        inntektId: {
          id: formProps.props.initialValue.person.vedtak.inntekt.id,
        },
        inntekt: {
          arbeidsInntektMaaned: [...g],
        },
        inntektsmottaker: {
          pnr: formProps.props.initialValue.person.naturligIdent,
          navn: formProps.props.initialValue.person.navn,
        },
        redigertAvSaksbehandler: formProps.props.initialValue.person.vedtak.inntekt.redigertAvSaksbehandler,
        manueltRedigert: formProps.props.initialValue.person.vedtak.inntekt.manueltRedigert,
        timestamp: formProps.props.initialValue.person.vedtak.inntekt.timestamp,
      };

      lagreInntekt({ ...inntekt, redigertAvSaksbehandler: dirty || values.manueltRedigert }, formProps.props.hentInntektStatus, formProps.props.locationData);

      formProps.setStatus({ success: true });
      formProps.setSubmitting(false);
    } catch (error) {
      formProps.setStatus({ failure: true });
      formProps.setError(error);
      throw new Error(error);
    }

    return false;

    // console.log(dirty);
  },
  displayName: 'InntektsForm',
  enableReinitialize: true,
})(InntektsForm);
