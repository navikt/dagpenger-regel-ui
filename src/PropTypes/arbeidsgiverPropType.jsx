import PropTypes from 'prop-types';

const arbeidsgiverPropType = PropTypes.shape({
  identifikator: PropTypes.string.isRequired,
  navn: PropTypes.string,
});

export default arbeidsgiverPropType;
