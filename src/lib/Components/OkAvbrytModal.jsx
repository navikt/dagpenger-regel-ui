import React from "react";
import PropTypes from "prop-types";
import Modal from "nav-frontend-modal";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { Normaltekst } from "nav-frontend-typografi";
import Spacer from "./Spacer";
import AdvarselIkon from "../../assets/svg/advarsel.svg";

export function OkAvbrytModal({ isOpen, text, avbrytCallback, OkCallback }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={avbrytCallback}
      closeButton={false}
      contentLabel={text}
      ariaHideApp={false}
    >
      <div className="okavbrytmodal">
        <div className="flex">
          <div className="flexcolumn">
            <div className="okavbrytmodal--ikon">
              <img src={AdvarselIkon} alt="" />
            </div>
          </div>
          <div className="flexcolumn okavbrytmodal--text">
            <Normaltekst>{text}</Normaltekst>
          </div>
        </div>
        <Spacer sixteenPx />
        <div className="knapprad hoyre">
          <Knapp htmlType="button" onClick={avbrytCallback}>
            Avbryt
          </Knapp>
          <Hovedknapp htmlType="button" onClick={OkCallback}>
            Bekreft
          </Hovedknapp>
        </div>
      </div>
    </Modal>
  );
}

OkAvbrytModal.propTypes = {
  text: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  avbrytCallback: PropTypes.func.isRequired,
  OkCallback: PropTypes.func.isRequired,
};

export default OkAvbrytModal;
