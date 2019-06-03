/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import Label, { labelPropType } from './Label';

export const RadioOption = ({
  name,
  label,
  value,
  actualValue,
  disabled,
  groupDisabled,
  onChange,
  children,
  manualHideChildren,
}) => {
  const stringifiedValue = JSON.stringify(value);
  const actualStringifiedValue = JSON.stringify(actualValue);
  const checked = stringifiedValue === actualStringifiedValue;
  return (
    <div>
      <Radio
        name={name}
        label={<Label beskrivelse={label} typographyElement={Normaltekst} />}
        value={value}
        checked={checked}
        disabled={disabled || groupDisabled}
      />
      {(checked || manualHideChildren) && children
      }
    </div>
  );
};

RadioOption.propTypes = {
  name: PropTypes.string,
  label: labelPropType,
  value: PropTypes.any.isRequired,
  actualValue: PropTypes.any,
  disabled: PropTypes.bool,
  groupDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  manualHideChildren: PropTypes.bool,
};

RadioOption.defaultProps = {
  name: '',
  label: undefined,
  disabled: false,
  groupDisabled: false,
  actualValue: undefined,
  onChange: () => undefined,
  children: undefined,
  manualHideChildren: false,
};

RadioOption.displayName = 'RadioOption';

export default RadioOption;
