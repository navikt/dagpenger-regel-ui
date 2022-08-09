import React from "react";

export function DisplayFormikState(props) {
  return (
    <div style={{ margin: "1rem 0" }}>
      <pre
        style={{
          background: "#f6f8fa",
          fontSize: "0.85rem",
          padding: "0.5rem",
          fontFamily: "monospace",
        }}
      >
        <strong>props</strong> = {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  );
}

export default DisplayFormikState;
