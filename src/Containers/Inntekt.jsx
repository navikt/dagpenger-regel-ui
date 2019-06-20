import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Modal from 'nav-frontend-modal';
import { Flatknapp } from 'nav-frontend-knapper';
import { FieldArray } from 'formik';
import SelectField from '../Components/SelectField';
import InputField from '../Components/InputField';
import { required } from '../Utils/validering';
import { OkAvbrytModal } from '../Components/OkAvbrytModal';
import { formatertPengesum } from '../Utils/currencyFormat';
import { VerdikoderContext } from '../Context/Verdikoder';
import { ReactComponent as SlettIkon } from '../images/slett.svg';


import NyInntekt from './NyInntekt';


const mapVerdikoder = typer => typer
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
  readOnly, inntekter, virksomhet, columnId, monthIndex,
}) => {
  const rowId = virksomhet.identifikator;
  const [editMode, setEditMode] = useState(true);
  const [isNyInntektModalOpen, setNyInntektModal] = useState(false);
  const [isSlettInntektModalOpen, setSlettInntektModal] = useState(false);
  const verdikoder = useContext(VerdikoderContext);
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
          tittelProps="ingress"
        >
          <FieldArray
            name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe`}
            render={arrayHelpers => (
              <>
                {inntekter.length > 0 && inntekter
                  .map((inntekt, index) => (
                    inntekt.virksomhet.identifikator === virksomhet.identifikator && (
                      // eslint-disable-next-line react/no-array-index-key
                      <div key={`${inntekt.verdikode}${index}`} className="flex inntekt">
                        <div>
                          <SelectField
                            bredde="xl"
                            label=""
                            selectValues={mapVerdikoder(verdikoder)}
                            validate={required}
                            name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].verdikode`}
                            readOnly={readOnly || editMode}
                          />
                          <InputField
                            label=""
                            name={`inntekt.arbeidsInntektMaaned[${monthIndex}].arbeidsInntektInformasjon.inntektListe[${index}].beloep`}
                            type="number"
                            validate={required}
                            formater
                            readOnly={readOnly || editMode}
                          />
                        </div>
                        {!readOnly && !editMode && (
                        <div className="flexend">
                          <button
                            type="button"
                            className="ikon ikon--slett"
                            onClick={() => setSlettInntektModal(index)}
                            title="Slett inntekt"
                          >
                            <SlettIkon />
                          </button>

                          <OkAvbrytModal
                            isOpen={isSlettInntektModalOpen === index}
                            text={`Er du sikker på at du vil slette ${inntekt.verdikode} - ${formatertPengesum(inntekt.beloep)}`}
                            avbrytCallback={() => setSlettInntektModal(false)}
                            OkCallback={() => {
                              arrayHelpers.remove(index);
                              setSlettInntektModal(!isSlettInntektModalOpen);
                            }}
                          />
                        </div>
                        )}
                      </div>
                    )
                  ))}
                {!readOnly && (
                  <div className="knapprad midstill">
                    <Flatknapp
                      htmlType="button"
                      mini
                      onClick={() => setEditMode(!editMode)}
                    >
                      Rediger
                    </Flatknapp>
                    <Flatknapp
                      htmlType="button"
                      mini
                      onClick={() => setNyInntektModal(!isNyInntektModalOpen)}
                    >
                      Legg til inntekt
                    </Flatknapp>
                    <Modal
                      isOpen={isNyInntektModalOpen}
                      onRequestClose={() => setNyInntektModal(false)}
                      closeButton={false}
                      contentLabel="Ny inntektspost"
                      ariaHideApp={false}
                    >
                      <NyInntekt
                        virksomhet={virksomhet}
                        dato={columnId}
                        arrayHelpers={arrayHelpers}
                        closeModal={() => setNyInntektModal(false)}
                      />

                    </Modal>

                  </div>
                )}

              </>
            )
        }
          />
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
  virksomhet: PropTypes.shape().isRequired,
  columnId: PropTypes.string.isRequired,
  monthIndex: PropTypes.number.isRequired,
};

export default Inntekt;
