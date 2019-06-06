import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import InputField from '../Components/InputField';
import { required } from '../Utils/validering';
import { DisplayFormikState } from '../Utils/formikUtils';

// todo lukke modal onsubmit
const NyMaaned = (props) => {
  const {
    values,
    handleSubmit,
    isSubmitting,
    closeModal,
  } = props;
  return (
    <>
      <Undertittel>
      Legg til ny måned
      </Undertittel>

      <InputField
        name="aarMaaned"
        label="Måned"
        type="month"
        validate={[required]}
      />

      <div className="knapprad">
        <Hovedknapp
          htmlType="submit"
          onClick={() => handleSubmit()}
        >
      Legg til
        </Hovedknapp>
        <Knapp
          htmlType="button"
          onClick={closeModal}
          disabled={isSubmitting}
        >
      Avbryt
        </Knapp>
      </div>

      <DisplayFormikState {...values} />

    </>
  );
};

NyMaaned.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  values: PropTypes.shape().isRequired,
};

export default withFormik({
  mapPropsToValues: ({
    arrayHelpers, closeModal,
  }) => ({
    aarMaaned: '2018-01',
    closeModal,
    arrayHelpers,
  }),
  // Custom sync validation
  validate: (values) => {
    const errors = {};

    return errors;
  },

  handleSubmit: (values, { setSubmitting }) => {
    const { arrayHelpers, closeModal } = values;
    arrayHelpers.push({
      aarMaaned: values.aarMaaned,
      arbeidsInntektInformasjon: {
        inntektListe: [],
      },
    });
    setSubmitting(false);
    closeModal();
  },

  displayName: 'nyMåned',

})(NyMaaned);
