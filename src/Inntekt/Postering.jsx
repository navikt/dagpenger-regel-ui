import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { FieldArray } from 'formik';
import Modal from 'nav-frontend-modal';
import { Flatknapp } from 'nav-frontend-knapper';
import { InputField, SelectField } from '../Form';
import { required } from '../Utils/validering';
import { VerdikoderContext } from '../Context/Verdikoder';
import { OkAvbrytModal } from '../Components/OkAvbrytModal';
import NyPostering from './NyPostering';

import { formatertPengesum } from '../Utils/currencyUtils';
import { ReactComponent as SlettIkon } from '../images/slett.svg';

const mapVerdikoder = typer =>
  typer.map(({ navn }) => (
    <option value={navn} key={navn}>
      {navn}
    </option>
  ));

// eslint-disable-next-line max-len
const sumInntekter = inntekter => inntekter.reduce((acc, val) => Number(acc) + Number(val.beloep), 0);

const Postering = ({ arbeidsgiver, arbeidsgiverIndex, dato, readOnly }) => {
  const [editMode, setEditMode] = useState(true);
  const [isNyInntektModalOpen, setNyInntektModal] = useState(false);
  const [isSlettInntektModalOpen, setSlettInntektModal] = useState(false);
  const verdikoder = useContext(VerdikoderContext);

  const { posteringer } = arbeidsgiver;

  return (
    <Ekspanderbartpanel tittel={formatertPengesum(sumInntekter(arbeidsgiver.posteringer[dato]))} tittelProps="ingress">
      <FieldArray
        name={`person.vedtak.inntekt.posteringer[${arbeidsgiverIndex}].posteringer[${dato}]`}
        render={arrayHelpers => (
          <>
            {posteringer[dato].length > 0 &&
              posteringer[dato].map((inntekt, index) => (
                <div key={`${inntekt.fordel}${arbeidsgiverIndex}`} className="flex inntekt">
                  <div>
                    <SelectField
                      bredde="xl"
                      label=""
                      selectValues={mapVerdikoder(verdikoder)}
                      validate={required}
                      name={`person.vedtak.inntekt.posteringer[${arbeidsgiverIndex}].posteringer[${dato}][${index}].fordel`}
                      readOnly={readOnly || editMode}
                    />
                    <InputField
                      label=""
                      name={`person.vedtak.inntekt.posteringer[${arbeidsgiverIndex}].posteringer[${dato}][${index}].beloep`}
                      type="number"
                      validate={required}
                      readOnly={readOnly || editMode}
                    />
                  </div>
                  {!readOnly && !editMode && (
                    <div className="flexend">
                      <button type="button" className="ikon ikon--slett" onClick={() => setSlettInntektModal(index)} title="Slett inntekt">
                        <SlettIkon />
                      </button>

                      <OkAvbrytModal
                        isOpen={isSlettInntektModalOpen === index}
                        text={`Er du sikker på at du vil slette ${inntekt.fordel} - ${formatertPengesum(inntekt.beloep)}`}
                        avbrytCallback={() => setSlettInntektModal(false)}
                        OkCallback={() => {
                          arrayHelpers.remove(index);
                          setSlettInntektModal(!isSlettInntektModalOpen);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            {!readOnly && (
              <div className="knapprad midstill">
                <Flatknapp htmlType="button" mini onClick={() => setEditMode(!editMode)}>
                  Rediger
                </Flatknapp>
                <Flatknapp htmlType="button" mini onClick={() => setNyInntektModal(!isNyInntektModalOpen)}>
                  Legg til inntekt
                </Flatknapp>
                <Modal
                  isOpen={isNyInntektModalOpen}
                  onRequestClose={() => setNyInntektModal(false)}
                  closeButton={false}
                  contentLabel="Ny inntektspost"
                  ariaHideApp={false}
                >
                  <NyPostering arbeidsgiver={arbeidsgiver} dato={dato} arrayHelpers={arrayHelpers} closeModal={() => setNyInntektModal(false)} />
                </Modal>
              </div>
            )}
          </>
        )}
      />
    </Ekspanderbartpanel>
  );
};

Postering.propTypes = {
  arbeidsgiver: PropTypes.shape().isRequired,
  arbeidsgiverIndex: PropTypes.number.isRequired,
  dato: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default Postering;
