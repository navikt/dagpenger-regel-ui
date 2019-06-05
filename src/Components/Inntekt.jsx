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

// to lage en compontent for dette
import { inntektTyper } from '../Kodeverk/verdikoder';

import NyInntekt from '../Containers/NyInntekt';

const mapTypeInntekter = typer => typer
  .map(navn => (<option value={navn} key={navn}>{navn}</option>));

// eslint-disable-next-line max-len
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
                      <div>
                        <SelectField
                          bredde="xl"
                          label=""
                          selectValues={mapTypeInntekter(inntektTyper)}
                          validate={[required]}
                          name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].beskrivelse`}
                          readOnly={editMode}
                        />
                        <InputField
                          label=""
                          name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].beloep`}
                          type="number"
                          validate={[required]}
                          formater
                          readOnly={editMode}
                        />
                      </div>
                      {editMode && (
                        <div className="flexend">
                          <button type="button" className="ikon ikon--slett" onClick={() => arrayHelpers.remove(index)} title="Slett inntekt">
                            <svg
                              version="1.1"
                              id="Filled_Version"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              x="0px"
                              y="0px"
                              width="18px"
                              height="18px"
                              viewBox="0 0 24 24"
                              enableBackground="new 0 0 24 24"
                              xmlSpace="preserve"
                            >
                              <path d="M13.414,12L23.707,1.707c0.391-0.391,0.391-1.023,0-1.414c-0.391-0.391-1.023-0.391-1.414,0L12,10.586L1.707,0.293
	c-0.391-0.391-1.023-0.391-1.414,0c-0.391,0.391-0.391,1.023,0,1.414L10.586,12L0.293,22.293c-0.391,0.391-0.391,1.023,0,1.414
	C0.488,23.902,0.744,24,1,24s0.512-0.098,0.707-0.293L12,13.414l10.293,10.293C22.488,23.902,22.744,24,23,24
	c0.256,0,0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414L13.414,12z"
                              />
                            </svg>
                          </button>
                        </div>

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
    label: PropTypes.string,
    beloep: PropTypes.string,
  })).isRequired,
  readOnly: PropTypes.bool.isRequired,
  rowId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  monthIndex: PropTypes.number.isRequired,
  formProps: PropTypes.shape().isRequired, // TODO create a proptype for formik
};

export default Inntekt;
