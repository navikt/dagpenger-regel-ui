import React from "react";
import NavFrontendSpinner from "nav-frontend-spinner";

function Spinner(props) {
  return (
    <div className="flex center">
      <NavFrontendSpinner {...props} />
    </div>
  );
}

export default Spinner;
