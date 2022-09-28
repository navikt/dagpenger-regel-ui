import React from "react";
import PropTypes from "prop-types";
import Arbeidsgiver from "../Components/Arbeidsgiver";
import Maaned from "../Components/Maaned";
import TotalMaaned from "../Components/TotalMaaned";
import TotalInntekt from "../Components/TotalInntekt";
import Inntekt from "./Inntekt";

// TODO fikse slik at vi ikke trenger å traverese dataen på nytt
export const buildCSSGrid = (inntekt, arbeidsgivere) => {
  const { arbeidsInntektMaaned } = inntekt;

  const maaneder = arbeidsInntektMaaned
    .sort((a, b) => a.aarMaaned.localeCompare(b.aarMaaned))
    .map((måned, index) => {
      if ((index + 1) % 12 === 0) {
        return `maaned--${måned.aarMaaned} maaned--total--${index}`;
      }
      return `maaned--${måned.aarMaaned}`;
    });
  const arbeidsgivereMedInntekter = arbeidsgivere.map((arbeidsgiver) => {
    const inntekter = arbeidsInntektMaaned.map((måned, index) => {
      if ((index + 1) % 12 === 0) {
        return `inntekter--${arbeidsgiver.identifikator}--${måned.aarMaaned} inntekter--${arbeidsgiver.identifikator}--total--${index}`;
      }
      return `inntekter--${arbeidsgiver.identifikator}--${måned.aarMaaned} `;
    });
    return `"arbeidsgiver--${arbeidsgiver.identifikator} ${inntekter.join(
      " "
    )}"`;
  });

  return `
  .grid {
    grid-template-areas: ". ${maaneder.join(
      " "
    )} " ${arbeidsgivereMedInntekter.join(" ")};
`;
};

export function Inntektstabell(props) {
  const { readOnly, dirty, values } = props;

  const { arbeidsgivere, inntekt } = values;

  if (!dirty) {
    window.setTimeout(() => {
      const elem = document.getElementById("grid");
      if (elem) {
        elem.scrollLeft = elem.scrollWidth;
      }
    }, 1);
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          // eslint-disable-line react/no-danger
          __html: buildCSSGrid(inntekt, arbeidsgivere),
        }}
      />

      <div className="grid" id="grid">
        {arbeidsgivere.length > 0 &&
          arbeidsgivere.map((arbeidsgiver) => (
            <Arbeidsgiver
              key={arbeidsgiver.identifikator}
              arbeidsgiver={arbeidsgiver}
            />
          ))}

        {inntekt.arbeidsInntektMaaned.map((måned, index) => {
          const total = [];
          if ((index + 1) % 12 === 0) {
            // todo burde optimaliseres
            const siste12 = inntekt.arbeidsInntektMaaned.slice(
              index - 11,
              index + 1
            );
            siste12.forEach((info) =>
              info.arbeidsInntektInformasjon.inntektListe.map((liste) =>
                total.push({
                  identifikator: `${liste.virksomhet.identifikator}`,
                  total: Number(liste.beloep),
                })
              )
            );
          }

          return (
            <React.Fragment key={måned.aarMaaned}>
              <Maaned maaned={måned.aarMaaned} />
              {(index + 1) % 12 === 0 && <TotalMaaned index={index} />}
              <>
                {arbeidsgivere.map((arbeidsgiver) => (
                  <React.Fragment
                    key={måned.aarMaaned + arbeidsgiver.identifikator}
                  >
                    <Inntekt
                      readOnly={readOnly}
                      virksomhet={arbeidsgiver}
                      columnId={måned.aarMaaned}
                      // eslint-disable-next-line react/no-array-index-key
                      key={arbeidsgiver.identifikator + index}
                      inntekter={måned.arbeidsInntektInformasjon.inntektListe}
                      monthIndex={index}
                      formProps={props}
                    />
                    {(index + 1) % 12 === 0 && (
                      <TotalInntekt
                        index={index}
                        identifikator={arbeidsgiver.identifikator}
                        total={total}
                      />
                    )}
                  </React.Fragment>
                ))}
              </>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}

Inntektstabell.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  values: PropTypes.shape().isRequired,
};

export default Inntektstabell;
