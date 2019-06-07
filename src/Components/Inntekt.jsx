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
import { ReactComponent as SlettIkon } from '../images/slett.svg';


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
  readOnly, inntekter, rowId, columnId, monthIndex,
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
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={`${inntekt.verdikode}${index}`} className="flex inntekt">
                      <div>
                        <SelectField
                          bredde="xl"
                          label=""
                          selectValues={mapTypeInntekter(inntektTyper)}
                          validate={[required]}
                          name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].verdikode`}
                          readOnly={readOnly || editMode}
                        />
                        <InputField
                          label=""
                          name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].beloep`}
                          type="number"
                          validate={[required]}
                          formater
                          readOnly={readOnly || editMode}
                        />
                      </div>
                      {editMode && (
                        <div className="flexend">
                          {
                            // TODO legge inn bekreftelse på sletting?
                          }
                          <button type="button" className="ikon ikon--slett" onClick={() => arrayHelpers.remove(index)} title="Slett inntekt">
                            <SlettIkon />
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
            onClick={() => setEditMode(!editMode)}
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
    beloep: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  })).isRequired,
  readOnly: PropTypes.bool.isRequired,
  rowId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  monthIndex: PropTypes.number.isRequired,
};

export default Inntekt;
