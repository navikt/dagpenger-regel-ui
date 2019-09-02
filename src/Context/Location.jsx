import React, { useEffect, useState, createContext } from 'react';
import PropTypes from 'prop-types';

const inntektRequest = queryParams => ({
  aktørId: queryParams.get('aktorId'),
  vedtakId: queryParams.get('vedtakId'),
  beregningsDato: queryParams.get('beregningdato'),
});

const LocationContext = createContext({});

const LocationData = ({ children, location }) => {
  const [getLocation, setLocation] = useState({});
  useEffect(() => {
    const getLocationParams = async () => {
      const locationParams = inntektRequest(new URLSearchParams(location.search));

      setLocation(locationParams);
    };

    getLocationParams();
  }, [location.search]);

  return <LocationContext.Provider value={getLocation}>{children}</LocationContext.Provider>;
};

LocationData.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.shape().isRequired,
};

export { LocationData, LocationContext };
