import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'nav-frontend-modal';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import { ReactComponent as AdvarselIkon } from '../images/advarsel.svg';

export const OkAvbrytModal = ({
  isOpen, text, avbrytCallback, OkCallback,
}) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={avbrytCallback}
    closeButton={false}
    contentLabel={text}
    ariaHideApp={false}
    shouldFocusAfterRender
  >
    <div className="okavbrytmodal">
      <div className="flex">
        <div className="flexcolumn">
          <div className="okavbrytmodal--ikon">
            <AdvarselIkon />
          </div>
        </div>
        <div className="flexcolumn okavbrytmodal--text">
          <Normaltekst>{text}</Normaltekst>
        </div>
      </div>

      <div className="knapprad hoyre">
        <Knapp htmlType="button" mini onClick={avbrytCallback}>
          Avbryt
        </Knapp>
        <Hovedknapp htmlType="button" mini onClick={OkCallback}>
          Bekreft
        </Hovedknapp>
      </div>
    </div>
  </Modal>
);

OkAvbrytModal.propTypes = {
  text: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  avbrytCallback: PropTypes.func.isRequired,
  OkCallback: PropTypes.func.isRequired,
};

export default OkAvbrytModal;
