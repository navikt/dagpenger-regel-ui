import React from 'react';
import PropTypes from 'prop-types';

// instance: "about:blank"
// status: 500
// title: "Uhåndtert feil!"
// type: "urn:dp:error:inntekt"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errors: null,
    };
  }


  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errors: error };
  }

  componentDidCatch(error, info) {
    return error;
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    const { hasError, errors } = this.state;
    const { children, apiErrors } = this.props;
    if (apiErrors.hasError) {
      return (
        <div className="feilmelding">
          {`Feil: ${apiErrors.status} ${apiErrors.statusText}: ${apiErrors.data.title}`}
        </div>
      );
    }
    if (hasError) {
      return (
        <div className="feilmelding">
          {`Feil: ${errors}`}
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  apiErrors: PropTypes.shape().isRequired,
};

export default ErrorBoundary;
