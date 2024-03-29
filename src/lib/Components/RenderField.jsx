import React from "react";
import PropTypes from "prop-types";
import { haystack } from "../Utils/arrayUtils";
import Label, { labelPropType } from "./Label";

// todo fikse props fra de forksjellige typene da de er litt ulike for input og select
const renderField = (WrappedNavFieldComponent) => {
  function FieldComponent({
    field,
    label,
    form,
    readOnly,
    isEdited,
    readOnlyHideEmpty,
    ...otherProps
  }) {
    const formatError = (submitFailed, error) => {
      if (submitFailed && error) {
        return { feilmelding: error };
      }
      return undefined;
    };

    const isEmpty =
      field.value === null || field.value === undefined || field.value === "";
    if (readOnly && readOnlyHideEmpty && isEmpty) {
      return null;
    }
    const fieldProps = {
      id: field.name,
      feil: formatError(form.isSubmitting, haystack(form.errors, field.name)),
      label: <Label label={label} readOnly={readOnly} />,
    };

    // eslint-disable-next-line max-len
    return (
      <WrappedNavFieldComponent
        {...fieldProps}
        {...field}
        {...otherProps}
        readOnly={readOnly}
      />
    );
  }

  FieldComponent.propTypes = {
    field: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
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

export default renderField;
