import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_VERDIKODER = gql`
  query {
    verdikoder {
      ... on Verdikode {
        navn
      }
    }
  }
`;

const VerdikoderContext = createContext({});

const Verdikoder = ({ children }) => {
  const { data } = useQuery(GET_VERDIKODER);

  return <VerdikoderContext.Provider value={data.verdikoder}>{children}</VerdikoderContext.Provider>;
};

Verdikoder.propTypes = {
  children: PropTypes.element.isRequired,
};

export { Verdikoder, VerdikoderContext };
