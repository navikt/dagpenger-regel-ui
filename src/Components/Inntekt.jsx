import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Modal from 'nav-frontend-modal';
import { Undertittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { Field, FieldArray } from 'formik';

import { InputField } from './InputField';

import { ReadOnlyField } from './ReadOnlyField';
import { required } from '../Utils/validering';
import { formatertPengesum } from '../Utils/currencyFormat';

import NyInntekt from '../Containers/NyInntekt';

const sumInntekter = inntekter => inntekter.reduce((acc, val) => Number(acc) + Number(val.beloep), 0);

const inntektStyle = (rowId, columnId) => `
.inntekter--${rowId}--${columnId} {
  grid-area: inntekter--${rowId}--${columnId};
}
`;

// TODO lage egen komponent for innholdet i modal og egen for radio
const Inntekt = ({
  readOnly, inntekter, rowId, columnId, monthIndex, formProps,
}) => {
  const [editMode, setEditMode] = useState(true);
  const [isModalOpen, setModal] = useState(false);
  return (
    <>
      <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: inntektStyle(rowId, columnId),
      }}
      />
      <div className={`item inntekter inntekter--${rowId}--${columnId}`}>
        <Ekspanderbartpanel
          tittel={formatertPengesum(sumInntekter(inntekter
            .filter(inntekt => inntekt.virksomhet.identifikator === rowId)))}
          tittelProps="element"
        >
          <FieldArray
            name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe`}
            render={arrayHelpers => (
              <>
                {inntekter.length > 0 && inntekter
                  .map((inntekt, index) => (
                    inntekt.virksomhet.identifikator === rowId && (
                    <div key={inntekt.beskrivelse} className="flex inntekt">
                      <Field
                        beskrivelse={inntekt.beskrivelse}
                        name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].beloep`}
                        component={editMode ? ReadOnlyField : InputField}
                        type="number"
                        validate={required}
                      />
                      {editMode && (
                      <Knapp
                        htmlType="button"
                        mini
                        onClick={() => arrayHelpers.remove(index)}
                      >
                              X
                      </Knapp>
                      )}
                    </div>
                    )
                  ))}
                <Knapp
                  htmlType="button"
                  mini
                  onClick={() => setModal(!isModalOpen)}
                >
                  Legg til inntektspost
                </Knapp>
                <Modal
                  isOpen={isModalOpen}
                  onRequestClose={() => setModal(false)}
                  closeButton={false}
                  contentLabel="Ny inntektspost"
                >
                  <NyInntekt arbeidsgiver={rowId} dato={columnId} arrayHelpers={arrayHelpers} closeModal={() => setModal(false)} />

                </Modal>


              </>
            )}
          />

          {!readOnly && (
          <Knapp
            htmlType="button"
            mini
            onClick={() => setEditMode(formProps.isValid && !editMode)}
          >
            {editMode ? 'Rediger' : 'Oppdater'}
          </Knapp>
          )}
        </Ekspanderbartpanel>
      </div>
    </>
  );
};

Inntekt.propTypes = {
  inntekter: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string,
    beskrivelse: PropTypes.string,
    beloep: PropTypes.string,
  })).isRequired,
  readOnly: PropTypes.bool.isRequired,
  rowId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  monthIndex: PropTypes.number.isRequired,
  formProps: PropTypes.shape().isRequired, // TODO create a proptype for formik
};

export default Inntekt;
