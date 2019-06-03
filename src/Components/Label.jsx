import React from 'react';
import PropTypes from 'prop-types';
import EditedIkon from './EditedIkon';

const Label = ({ label, isEdited, readOnly }) => {
  if (!label) {
    return null;
  }
  return (
    <div className="flex label">
      {label}
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
  label: PropTypes.string,
  isEdited: PropTypes.bool,
  readOnly: PropTypes.bool,
};

Label.defaultProps = {
  label: '',
  isEdited: false,
  readOnly: false,
};

export default Label;
