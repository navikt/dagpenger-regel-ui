import React from 'react';
import { Select } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';

const formatError = (touched, error) => {
  if (touched && error) {
    return { feilmelding: error };
  }
  return undefined;
};

const SelectField = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  children,
  ...props
}) => {
  const feil = formatError(touched[field.name], errors[field.name]);
  return (
    <Select {...field} {...props} feil={feil}>
      {children}
    </Select>
  );
};

SelectField.propTypes = {
  field: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default SelectField;
