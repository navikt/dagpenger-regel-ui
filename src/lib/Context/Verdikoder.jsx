import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getVerdikoder } from "../inntektApiClient";

const VerdikoderContext = createContext({});

function Verdikoder({ children }) {
  const [verdikoder, setVerdikoder] = useState([]);

  useEffect(() => {
    const getVerdikoderFromApi = async () => {
      setVerdikoder(await getVerdikoder());
    };

    getVerdikoderFromApi();
  }, []);

  return (
    <VerdikoderContext.Provider value={verdikoder}>
      {children}
    </VerdikoderContext.Provider>
  );
}

Verdikoder.propTypes = {
  children: PropTypes.element.isRequired,
};

export { Verdikoder, VerdikoderContext };
