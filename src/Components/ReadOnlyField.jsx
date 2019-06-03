import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import { formatertPengesum } from '../Utils/currencyFormat';
import { haystack } from '../Utils/objectUtils';
import Label from './Label';

export const ReadOnlyField = ({
  label, formater, field, form, ...otherProps
}) => {
  const isEdited = !haystack(form.touched, field.name);

  return (
    <div>
      <Label label={label} isEdited={isEdited} />
      <Element className="inntektbeloep">{formater ? formatertPengesum(field.value) : field.value}</Element>
    </div>
  );
};


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
