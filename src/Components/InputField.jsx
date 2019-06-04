import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { Input } from 'nav-frontend-skjema';

import RenderField from './RenderField';
import { ReadOnlyField } from './ReadOnlyField';
import { labelPropType } from './Label';

const renderNavInput = RenderField(Input);

const InputField = ({
  name, type, label, validate, readOnly, isEdited, ...otherProps
}) => (
  <Field
    name={name}
    validate={validate}
    component={readOnly ? ReadOnlyField : renderNavInput}
    type={type}
    label={label}
    {...otherProps}
    readOnly={readOnly}
    isEdited={isEdited}
    autoComplete="off"
  />
);

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: labelPropType,
  validate: PropTypes.arrayOf(PropTypes.func),
  readOnly: PropTypes.bool,
  isEdited: PropTypes.bool,
};

InputField.defaultProps = {
  type: 'text',
  validate: null,
  readOnly: false,
  label: '',
  isEdited: false,
};

export default InputField;
