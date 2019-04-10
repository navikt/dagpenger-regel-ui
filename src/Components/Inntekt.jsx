import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Element, EtikettLiten } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

const sumInntekter = inntekter => inntekter.reduce((acc, val) => acc + val.beloep, 0);

const formatertPengesum = tall => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' }).format(tall);

const resize = (rowId, columnId) => {
  const newHeight = (document.querySelector(`.prefix${rowId}${columnId}`) || {}).height;
  document.querySelectorAll(`.prefix${rowId}`).forEach((el) => { el.style.height = newHeight; });
  return newHeight;
};

const Inntekt = ({ inntekter, rowId, columnId }) => (
  <div className={classNames('item', 'inntekter', `prefix${rowId}`, `prefix${rowId}${columnId}`)} style={{ height: resize(rowId, columnId) }}>
    <Ekspanderbartpanel
      tittel={formatertPengesum(sumInntekter(inntekter))}
      tittelProps="element"
    >
      {inntekter.map(inntekt => (
        <div key={inntekt.beskrivelse} className="inntekt">
          <EtikettLiten>{inntekt.beskrivelse}</EtikettLiten>
          <Element className="inntektbeloep">{formatertPengesum(inntekt.beloep)}</Element>
        </div>
      ))}
    </Ekspanderbartpanel>
  </div>
);

Inntekt.propTypes = {
  inntekter: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string,
    beskrivelse: PropTypes.string,
    beloep: PropTypes.number,
  })).isRequired,
  rowId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
};

export default Inntekt;
