import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import InputField from '../Components/InputField';
import { required } from '../Utils/validering';

// todo lukke modal onsubmit
export const NyMaanedImpl = (props) => {
  const {
    handleSubmit,
    isSubmitting,
    closeModal,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
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
          disabled={isSubmitting}
        >
      Legg til
        </Hovedknapp>
        <Knapp
          htmlType="button"
          onClick={closeModal}

        >
      Avbryt
        </Knapp>
      </div>

    </form>
  );
};

NyMaanedImpl.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

const NyMaaned = withFormik({
  mapPropsToValues: () => ({
    aarMaaned: '2018-01',
  }),
  // Custom sync validation
  validate: (values) => {
    const errors = {};

    return errors;
  },

  handleSubmit: (values, { setSubmitting, props }) => {
    const { arrayHelpers, closeModal } = props;
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

})(NyMaanedImpl);

export default NyMaaned;
