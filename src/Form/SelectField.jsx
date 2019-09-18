import React from 'react';
import { Select } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import Label from '../Components/Label';

const formatError = (touched, error) => {
  if (touched && error) {
    return { feilmelding: error };
  }
  return undefined;
};

const SelectField = ({ field, label, readOnly, form: { touched, errors }, children, ...props }) => {
  const feil = formatError(touched[field.name], errors[field.name]);
  const isEdited = touched[field.name];
  if (readOnly) {
    return (
      <>
        <Label label={label} isEdited={isEdited} />
        <Element className="inntektbeloep">{field.value}</Element>
      </>
    );
  }
  return (
    <Select label={label} {...field} {...props} feil={feil}>
      {children}
    </Select>
  );
};

SelectField.propTypes = {
  label: PropTypes.string,
  field: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  formater: PropTypes.bool,
  readOnly: PropTypes.bool,
};

SelectField.defaultProps = {
  label: '',
  formater: false,
  readOnly: false,
};

export default SelectField;
