import React from 'react';
import { Input } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';

const formatError = (touched, error) => {
  if (touched && error) {
    return { feilmelding: error };
  }
  return undefined;
};

const InputField = ({ field, form: { touched, errors }, ...props }) => {
  const feil = formatError(touched[field.name], errors[field.name]);

  return <Input type="text" id={field.name} {...field} {...props} feil={feil} />;
};

InputField.propTypes = {
  field: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
};

export default InputField;
