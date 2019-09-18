import React from 'react';
import { Input } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import { formatertPengesum } from '../Utils/currencyUtils';
import Label from '../Components/Label';

const formatError = (touched, error) => {
  if (touched && error) {
    return { feilmelding: error };
  }
  return undefined;
};

const InputField = ({ field, label, readOnly, formater, form: { touched, errors }, ...props }) => {
  const feil = formatError(touched[field.name], errors[field.name]);
  const isEdited = touched[field.name];
  const formaterSum = value => (formater ? formatertPengesum(value) : value);
  if (readOnly) {
    return (
      <>
        <Label label={label} isEdited={isEdited} />
        <Element className="inntektbeloep">{formaterSum(field.value)}</Element>
      </>
    );
  }
  return <Input type="text" label={label} id={field.name} {...field} {...props} feil={feil} />;
};

InputField.propTypes = {
  label: PropTypes.string,
  field: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  formater: PropTypes.bool,
  readOnly: PropTypes.bool,
};

InputField.defaultProps = {
  label: '',
  formater: false,
  readOnly: false,
};

export default InputField;
