import PropTypes from 'prop-types';

const dashboardPropType = PropTypes.shape({
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  readOnly: PropTypes.bool.isRequired,
});

export default dashboardPropType;
