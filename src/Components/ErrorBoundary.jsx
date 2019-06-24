import React from 'react';
import PropTypes from 'prop-types';

// instance: "about:blank"
// status: 500
// title: "Uhåndtert feil!"
// type: "urn:dp:error:inntekt"

const getErrorData = response => (response.data ? response.data : response.statusText);


const formatError = (error) => {
  const response = error && error.response ? error.response : undefined;
  return {
    data: response ? getErrorData(response) : undefined,
    type: response && response.data ? response.data.type : undefined,
    status: response ? response.status : undefined,
  };
};

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
      const error = formatError(apiErrors);
      let feilmelding;

      switch (error.status) {
        case 404:
          feilmelding = 'En feil har oppstått i forbindelse med tjenestekallet til inntekt';
          break;
        case 418:
          feilmelding = '';
          break;
        case 403:
          feilmelding = '';
          break;
        case 401:
          feilmelding = '';
          break;
        default:
          feilmelding = 'Uhåndert feil';
          break;
      }

      return (
        <div className="feilmelding">
          {`Feil: ${error.status} ${feilmelding}`}
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
