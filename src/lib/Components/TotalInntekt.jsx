import React from "react";
import PropTypes from "prop-types";
import { Ingress } from "nav-frontend-typografi";
import { formatertPengesum } from "../Utils/currencyUtils";

const maanedStyle = (index, identifikator) => `
.inntekter--${identifikator}--total--${index} {
  grid-area: inntekter--${identifikator}--total--${index};
}
`;

function TotalInntekt({ index, identifikator, total }) {
  const totalInntekt = total
    .filter((r) => identifikator === r.identifikator)
    .reduce((arr, curr) => Number(arr) + Number(curr.total), Number(0));

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          // eslint-disable-line react/no-danger
          __html: maanedStyle(index, identifikator),
        }}
      />
      <div
        className={`item inntekter total inntekter--${identifikator}--total--${index}`}
      >
        <Ingress>{formatertPengesum(totalInntekt)}</Ingress>
      </div>
    </>
  );
}

TotalInntekt.propTypes = {
  index: PropTypes.number.isRequired,
  identifikator: PropTypes.string.isRequired,
  total: PropTypes.arrayOf(
    PropTypes.shape({
      identifikator: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TotalInntekt;
