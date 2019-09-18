import React from 'react';
import PropTypes from 'prop-types';
import { captureException, withScope } from '@sentry/browser';

// todo 3 forskjellige måter å få feil på som må merges og vises på en god måte

// detail: "Inntekt with for InntektRequest(aktørId=1000009228307, vedtakId=31822801, beregningsDato=2019-01-11) not found."
// instance: "about:blank"
// status: 404
// title: "Kunne ikke finne inntekt i databasen"
// type: "urn:dp:error:inntekt"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: {},
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error: [
        error.toString(),
        info.componentStack
          .split('\n')
          .map(line => line.trim())
          .find(line => !!line),
      ].join(' '),
    });
    // send til sentry
    withScope(scope => {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key]);
        captureException(error);
      });
    });
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      let feilmelding;

      switch (error.status) {
        case 404:
          feilmelding = 'En feil har oppstått i forbindelse med tjenestekallet til inntekt';
          break;
        case 418:
          feilmelding = 'I´M A TEAPOT';
          break;
        case 403:
          feilmelding = 'Du er ikke autorisert';
          break;
        case 401:
          feilmelding = 'Du er ikke autorisert';
          break;
        case 500:
          feilmelding = '500';
          break;
        default:
          feilmelding = error;
          break;
      }

      return <div className="feilmelding">{`Feilmelding: ${feilmelding}`}</div>;
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ErrorBoundary;
