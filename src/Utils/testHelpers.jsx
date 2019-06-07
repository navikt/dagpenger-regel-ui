export const noop = () => {};

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


export const formPropsMock = {
  dirty: false,
  errors: {},
  handleBlur: noop, // (eventOrPath),
  handleChange: noop, // (eventOrPath)
  handleReset: noop, // ()
  handleSubmit: noop, // (e)
  initialValues: {},
  isSubmitting: false,
  isValid: false,
  isValidating: false,
  registerField: noop, // (name, Comp)
  resetForm: noop, // (nextValues)
  setError: noop, // (error)
  setErrors: noop, // (errors)
  setFieldError: noop, // (field, message)
  setFieldTouched: noop, // (field, touched, shouldValidate)
  setFieldValue: noop, // (field, value, shouldValidate)
  setFormikState: noop, // (s, callback)
  setStatus: noop, // (status)
  setSubmitting: noop, // (isSubmitting)
  setTouched: noop, // (touched)
  setValues: noop, // (values)
  status: undefined,
  submitCount: 0,
  submitForm: noop, // ()
  touched: {},
  unregisterField: noop, // (name)
  validateField: noop, // (field)
  validateForm: noop, // (values)
  validateOnBlur: true,
  validateOnChange: true,
};
