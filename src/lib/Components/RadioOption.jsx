import React from "react";
import PropTypes from "prop-types";
import { Radio } from "nav-frontend-skjema";
import { Normaltekst } from "nav-frontend-typografi";

import Label, { labelPropType } from "./Label";

export function RadioOption({
  name,
  label,
  value,
  actualValue,
  disabled,
  groupDisabled,
  onChange,
  children,
}) {
  const stringifiedValue = JSON.stringify(value);
  const actualStringifiedValue = JSON.stringify(actualValue);
  const checked = stringifiedValue === actualStringifiedValue;
  return (
    <>
      <Radio
        name={name}
        label={<Label label={label} typographyElement={Normaltekst} />}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled || groupDisabled}
      />
      {checked && children}
    </>
  );
}

RadioOption.propTypes = {
  name: PropTypes.string,
  label: labelPropType,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  actualValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  disabled: PropTypes.bool,
  groupDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

RadioOption.defaultProps = {
  name: "",
  label: undefined,
  disabled: false,
  groupDisabled: false,
  actualValue: undefined,
  onChange: () => undefined,
  children: undefined,
};

RadioOption.displayName = "RadioOption";

export default RadioOption;
