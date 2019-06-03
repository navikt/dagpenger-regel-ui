import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Modal from 'nav-frontend-modal';
import { Knapp } from 'nav-frontend-knapper';
import { FieldArray } from 'formik';
import SelectField from './SelectField';
import InputField from './InputField';
import { required } from '../Utils/validering';
import { formatertPengesum } from '../Utils/currencyFormat';

import verdikoder from '../lib/verdikoder';

import { NyInntekt } from '../Containers/NyInntekt';

const mapTypeInntekter = typer => typer
  .map(navn => (<option value={navn} key={navn}>{navn}</option>));

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
                    <div key={inntekt.beskrivelse} className="inntekt">
                      <SelectField
                        bredde="xl"
                        selectValues={mapTypeInntekter(verdikoder)}
                        validate={[required]}
                        name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].beskrivelse`}
                        readOnly={editMode}
                      />
                      <InputField
                        beskrivelse=""
                        name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].beloep`}
                        type="number"
                        validate={required}
                        format
                        readOnly={editMode}
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
                  Legg til inntekt
                </Knapp>
                <Modal
                  isOpen={isModalOpen}
                  onRequestClose={() => setModal(false)}
                  closeButton={false}
                  contentLabel="Ny inntektspost"
                  ariaHideApp={false}
                >
                  <NyInntekt
                    arbeidsgiver={rowId}
                    dato={columnId}
                    arrayHelpers={arrayHelpers}
                    closeModal={() => setModal(false)}
                  />

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
