import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFormik, FieldArray } from 'formik';
import isEqual from 'lodash.isequal';
// import { useMutation } from '@apollo/react-hooks';
// import gql from 'graphql-tag';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element, Undertekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp, Flatknapp } from 'nav-frontend-knapper';
import Spacer from '../Components/Spacer';
import Inntekt from './Inntekt';
import Arbeidsgiver from '../Arbeidsgiver/Arbeidsgiver';
import NyArbeidsgiver from '../Arbeidsgiver/NyArbeidsgiver';
import OkAvbrytModal from '../Components/OkAvbrytModal';
import DatoLabel from '../Components/DatoLabel';
import { MMMM_YYYY_FORMAT } from '../Utils/datoFormat';

const scrollToRef = ref => {
  const elem = document.getElementById('grid');
  elem.scrollTo({
    top: 0,
    left: ref.current.offsetLeft - 250,
    behavior: 'smooth',
  });
};

/*
const ADD_INNTEKT = gql`
  mutation($periode: YearMonthInput, $beloep: Float, $fordel: String, $dato: String, $beskrivelse: String) {
    addPostering(periode: $periode, beloep: $beloep, fordel: $fordel, dato: $dato, beskrivelse: $beskrivelse) {
      id
    }
  }
`;


const DELETE_INNTEKT = gql`
  mutation($id: ID!) {
    deletePostering(id: $id) {
      id
    }
  }
`;

const UPDATE_INNTEKT = gql`
  mutation($beloep: Float, $fordel: String) {
    updatePostering(beloep: $beloep, fordel: $fordel) {
      id
    }
  }
`;
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
          <div className="ss" id="grid">
            <table className="inntektstabell">
              <thead>
                <tr>
                  <td />
                  {måneder &&
                    måneder.map((måned, index) => {
                      tdRefs[index] = React.createRef();
                      return (
                        <React.Fragment key={måned}>
                          <td className="item maaned" ref={tdRefs[index]}>
                            <DatoLabel dato={måned} datoFormat={MMMM_YYYY_FORMAT} />
                          </td>
                          {(index + 1) % 12 === 0 && (
                            <td className="item maaned" ref={tdRefs[index]}>
                              Totalt
                            </td>
                          )}
                        </React.Fragment>
                      );
                    })}
                </tr>
              </thead>
              <tbody>
                {person.vedtak.inntekt.posteringer &&
                  person.vedtak.inntekt.posteringer.map((arbeidsgiver, arbeidsgiverIndex) => (
                    <tr key={arbeidsgiver.identifikator}>
                      <Arbeidsgiver readOnly={readOnly} arbeidsgiver={arbeidsgiver} />
                      <Inntekt readOnly={readOnly} arbeidsgiver={arbeidsgiver} arbeidsgiverIndex={arbeidsgiverIndex} />
                    </tr>
                  ))}
              </tbody>
            </table>
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
                  render={arrayHelpers => <NyArbeidsgiver person={person} arrayHelpers={arrayHelpers} closeModal={() => setArbeidsgiverModal(false)} />}
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
  // endre til mutation
  handleSubmit: (values, formProps) => {
    // console.log(values, formProps);
    const dirty = !isEqual(formProps.props.initialValues, values);

    if (dirty) {
      // mutate posteringer, slettet, nye og endrede
      return true;
    }
    return false;

    // console.log(dirty);
  },
  displayName: 'InntektsForm',
  enableReinitialize: true,
})(InntektsForm);
