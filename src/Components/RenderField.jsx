import React from 'react';
import PropTypes from 'prop-types';
import { haystack } from '../Utils/objectUtils';
import Label, { labelPropType } from './Label';

// todo fikse props fra de forksjellige typene da de er litt ulike for input og select
const renderNavField = (WrappedNavFieldComponent) => {
  const FieldComponent = ({
    name, field, label, form, readOnly, isEdited, readOnlyHideEmpty, ...otherProps
  }) => {
    const formatError = (submitFailed, error) => {
      if (submitFailed && error) {
        return { feilmelding: error };
      }
      return undefined;
    };

    const isEmpty = field.value === null || field.value === undefined || field.value === '';
    if (readOnly && readOnlyHideEmpty && isEmpty) {
      return null;
    }
    const fieldProps = {
      id: field.name,
      feil: formatError(!form.isValid, haystack(form.errors, field.name)),
      label: <Label beskrivelse={label} readOnly={readOnly} />,
    };

    return (<WrappedNavFieldComponent {...fieldProps} {...field} {...otherProps} readOnly={readOnly} />);
  };

  FieldComponent.propTypes = {
    label: labelPropType,
    readOnly: PropTypes.bool,
    readOnlyHideEmpty: PropTypes.bool,
    isEdited: PropTypes.bool,
  };

  FieldComponent.defaultProps = {
    label: undefined,
    readOnly: false,
    readOnlyHideEmpty: false,
    isEdited: false,
  };

  return FieldComponent;
};


export default renderNavField;
