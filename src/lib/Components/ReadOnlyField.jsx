import React from "react";
import PropTypes from "prop-types";
import { Element } from "nav-frontend-typografi";
import { formatertPengesum } from "../Utils/currencyUtils";
import { haystack } from "../Utils/arrayUtils";
import Label from "./Label";

export function ReadOnlyField({ label, formater, field, form }) {
  const isEdited = !haystack(form.touched, field.name);
  const formaterSum = (value) => (formater ? formatertPengesum(value) : value);
  return (
    <div>
      <Label label={label} isEdited={isEdited} />
      <Element className="inntektbeloep">{formaterSum(field.value)}</Element>
    </div>
  );
}

ReadOnlyField.propTypes = {
  label: PropTypes.string.isRequired,
  field: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  formater: PropTypes.bool,
};

ReadOnlyField.defaultProps = {
  formater: false,
};

export default ReadOnlyField;
