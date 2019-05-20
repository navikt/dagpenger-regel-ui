import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'nav-frontend-skjema';
import { haystack } from '../Utils/objectUtils';
import Label from './Label';

// isValid?
// feil={{ feilmelding: 'Her er det noe feil' }}

const formatError = (submitFailed, error) => {
  if (submitFailed && error) {
    return { feilmelding: error };
  }
  return undefined;
};

export const InputField = ({
  beskrivelse, type, field, form,
}) => {
  const feilmeldinger = {
    feil: formatError(!form.isValid, haystack(form.errors, field.name)),
  };
  return (
    <Input label={<Label beskrivelse={beskrivelse} />} type={type} {...feilmeldinger} {...field} value={field.value} />
  );
};

InputField.propTypes = {
  beskrivelse: PropTypes.string.isRequired,
  field: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  type: PropTypes.string,
};

InputField.defaultProps = {
  type: 'text',
};

export default InputField;
