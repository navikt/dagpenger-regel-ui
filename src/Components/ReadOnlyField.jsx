import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import { formatertPengesum } from '../Utils/currencyFormat';
import { haystack } from '../Utils/objectUtils';
import Label from './Label';

export const ReadOnlyField = ({
  beskrivelse, format, field, form, ...otherProps
}) => {
  const isEdited = !haystack(form.touched, field.name);

  return (
    <div>
      <Label beskrivelse={beskrivelse} isEdited={isEdited} />
      <Element className="inntektbeloep">{format ? formatertPengesum(field.value) : field.value}</Element>
    </div>
  );
};


ReadOnlyField.propTypes = {
  beskrivelse: PropTypes.string.isRequired,
  field: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
};

export default ReadOnlyField;
