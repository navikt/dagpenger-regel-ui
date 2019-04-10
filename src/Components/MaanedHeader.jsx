import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';

const MaanedHeader = ({ maaned }) => (
  <div className="item maanednavn">
    <Element>{maaned}</Element>
  </div>
);

MaanedHeader.propTypes = {
  maaned: PropTypes.string.isRequired,
}

export default MaanedHeader;
