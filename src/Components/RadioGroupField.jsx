import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { RadioOption } from './RadioOption';
import RenderField from './RenderField';

// todo fikse proptypes
const renderRadioGroupField = RenderField(({
  label,
  id,
  name,
  value,
  onChange,
  bredde,
  readOnly,
  isEdited,
  feil,
  children,
}) => {
  const optionProps = {
    name,
    groupDisabled: readOnly,
    actualValue: value,
    onChange,
  };
  return (
    <SkjemaGruppe feil={readOnly ? undefined : feil} className={`input--${bredde} radioGroup`}>
      {label.props.label && <span className={`radioGroupLabel ${readOnly}`}>{label}</span>}
      { children
        .map(radioOption => React.cloneElement(radioOption, {
          key: JSON.stringify(radioOption.props.value),
          ...optionProps,
        }))}
    </SkjemaGruppe>
  );
});

export const RadioGroupField = props => (
  <Field
    component={renderRadioGroupField}
    {...props}
  />
);

const radioOptionsOnly = (options, key) => {
  const option = options[key];
  if (option) {
    const type = option.type || {};
    if (type.displayName !== RadioOption.displayName) {
      return new Error('RadioGroupField children should be of type "RadioOption"');
    }
  }
  return undefined;
};

RadioGroupField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  /**
   * columns: Antall kolonner som valgene skal fordeles på. Default er samme som antall valg.
   */
  columns: PropTypes.number,
  bredde: PropTypes.string,
  children: PropTypes.arrayOf(radioOptionsOnly).isRequired,
  spaceBetween: PropTypes.bool,
  rows: PropTypes.number,
  direction: PropTypes.string,
  DOMName: PropTypes.string,
};

RadioGroupField.defaultProps = {
  columns: 0,
  rows: 0,
  bredde: 'fullbredde',
  label: '',
  spaceBetween: false,
  direction: 'horizontal',
  DOMName: undefined,
};

export default RadioGroupField;
