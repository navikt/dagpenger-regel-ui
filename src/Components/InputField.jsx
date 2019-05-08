import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'nav-frontend-skjema';

// isValid?
// feil={{ feilmelding: 'Her er det noe feil' }}

// TODO finne en bedre måte å finne feilmeldingene på så vi slipper denne funksjonen
export const haystack = (object, keys, defaultValue = null) => {
  const keysArray = Array.isArray(keys) ? keys : keys.replace(/(\[(\d+)\])/g, '.$2').split('.');
  const currentObject = object[keysArray[0]];
  if (currentObject && keysArray.length > 1) {
    return haystack(currentObject, keysArray.slice(1), defaultValue);
  }
  return currentObject === undefined ? defaultValue : currentObject;
};


const formatError = (submitFailed, error) => {
  if (submitFailed && error) {
    return { feilmelding: error };
  }
  return undefined;
};

export const InputField = ({
  beskrivelse, field, form,
}) => {
  const feilmeldinger = {
    feil: formatError(!form.isValid, haystack(form.errors, field.name)),
  };
  return (<Input label={beskrivelse} type="number" {...feilmeldinger} {...field} value={field.value} />);
};

InputField.propTypes = {
  beskrivelse: PropTypes.string.isRequired,
  field: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
};

export default InputField;
