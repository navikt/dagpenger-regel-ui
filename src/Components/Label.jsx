import React from 'react';
import PropTypes from 'prop-types';
import EditedIkon from './EditedIkon';

const Label = ({ beskrivelse, isEdited, readOnly }) => {
  if (!beskrivelse) {
    return null;
  }
  return (
    <div className="flex label">
      {beskrivelse}
      {isEdited && <EditedIkon /> }
    </div>
  );
};

export const labelPropType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    args: PropTypes.shape(),
  }),
]);

Label.propTypes = {
  beskrivelse: PropTypes.string,
  isEdited: PropTypes.bool,
  readOnly: PropTypes.bool,
};

Label.defaultProps = {
  beskrivelse: '',
  isEdited: false,
  readOnly: false,
};

export default Label;
