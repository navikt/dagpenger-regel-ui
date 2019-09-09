import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import Spinner from '../Components/Spinner';

const GET_VERDIKODER = loader('./GET_VERDIKODER.gql');

const VerdikoderContext = createContext({});

const Verdikoder = ({ children }) => {
  const { data, loading, error } = useQuery(GET_VERDIKODER);

  if (loading) {
    return <Spinner type="XL" />;
  }

  if (error || !data.verdikoder) {
    return <div>error</div>;
  }

  const { verdikoder } = data;
  return <VerdikoderContext.Provider value={verdikoder}>{children}</VerdikoderContext.Provider>;
};

Verdikoder.propTypes = {
  children: PropTypes.element.isRequired,
};

export { Verdikoder, VerdikoderContext };
