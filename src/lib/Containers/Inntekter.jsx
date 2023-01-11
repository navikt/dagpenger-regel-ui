import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Flatknapp, Knapp } from "nav-frontend-knapper";
import AlertStripe from "nav-frontend-alertstriper";
import { Element, Ingress, Normaltekst } from "nav-frontend-typografi";
import Panel from "nav-frontend-paneler";
import { formatDistance } from "date-fns";
import { nb } from "date-fns/locale";
import { captureException, showReportDialog } from "@sentry/browser";
import Spinner from "../../lib/Components/Spinner";
import Spacer from "../../lib/Components/Spacer";
import InntektsForm from "../../lib/Containers/InntektsForm";
import { DDMMYYYYHHMM_FORMAT } from "../../lib/Utils/datoFormat";
import { eachMonthOfInterval, formatDato } from "../../lib/Utils/datoUtils";
import { OkAvbrytModal } from "../../lib/Components/OkAvbrytModal";
import EditedIkon from "../../lib/Components/EditedIkon";
import MannIkon from "../../assets/svg/mann.svg";
import KvinneIkon from "../../assets/svg/kvinne.svg";
import { getInntekt, getUncachedInntekt } from "../../lib/inntektApiClient";
import { getOrganisasjonsNavn } from "../../lib/brregApiClient";
import { uniqBy } from "lodash";

const getKjønn = (fødselsnr = "") => {
  if (Number(fødselsnr.charAt(8)) % 2 === 0) {
    return <KvinneIkon />;
  }

  return <MannIkon />;
};

const sendTilbakemelding = () => {
  const eventId = captureException("test");
  showReportDialog({
    eventId,
    title: "Hvordan opplever du løsningen?",
    subtitle: "Hjelp  oss å gjøre løsningen bedre. Gi oss tilbakemelding.",
    subtitle2: "Feil melder du på vanlig måte via Porten.",
    labelName: "Navn",
    labelEmail: "E-post",
    labelComments: "Tilbakemelding",
    labelClose: "Lukk",
    labelSubmit: "Send",
    successMessage: "Takk for tilbakemeldingen.",
  });
};

export const findArbeidsgivere = async (inntekt) => {
  const arbeidsgivere = uniqBy(
    inntekt.arbeidsInntektMaaned.flatMap((mnd) =>
      mnd.arbeidsInntektInformasjon.inntektListe.map(
        ({ virksomhet }) => virksomhet
      )
    ),
    "identifikator"
  );

  const medNavn = arbeidsgivere.map(async (a) => {
    if (a.aktoerType === "NATURLIG_IDENT") {
      return { ...a, navn: "Privatperson" };
    } else {
      const { navn } = await getOrganisasjonsNavn(a.identifikator);
      return { ...a, navn };
    }
  });

  return Array.from(await Promise.all(medNavn)).sort(
    (a, b) => b.identifikator - a.identifikator
  );
};

export const inntektRequest = (queryParams) => ({
  aktørId: queryParams.get("aktorId"),
  vedtakId: queryParams.get("vedtakId"),
  beregningsDato: queryParams.get("beregningdato"),
});

// TODO hente bredde dynamisk tilfelle, bruke useRef
const gåTilForrige12 = () => {
  const elem = document.getElementById("grid");
  if (elem && elem.scrollLeft / 3 > 1250) {
    elem.scrollTo({
      top: 0,
      left: elem.scrollLeft - 3250,
      behavior: "smooth",
    });
  }
};

// TODO hente bredde dynamisk tilfelle, bruke useRef
const gåTilNeste12 = () => {
  const elem = document.getElementById("grid");
  if (elem && elem.scrollLeft <= 6500) {
    elem.scrollTo({
      top: 0,
      left: elem.scrollLeft + 3250,
      behavior: "smooth",
    });
  }
};

const getAlleMåneder = (fraDato, tilDato) => {
  const måneder = eachMonthOfInterval({
    start: new Date(fraDato),
    end: new Date(tilDato),
  });

  return måneder;
};

const set36Måneder = (data) => {
  const { fraDato, tilDato } = (data || []).inntekt;
  if (fraDato && tilDato) {
    const måneder = getAlleMåneder(fraDato, tilDato);

    if (data.inntekt.arbeidsInntektMaaned === undefined) {
      // eslint-disable-next-line no-param-reassign
      data.inntekt.arbeidsInntektMaaned = [];
    }

    måneder.forEach((måned) => {
      const isMånedEksisterer = (data.inntekt.arbeidsInntektMaaned || []).some(
        (inntekt) => måned === inntekt.aarMaaned
      );

      if (!isMånedEksisterer) {
        data.inntekt.arbeidsInntektMaaned.push({
          aarMaaned: måned,
          arbeidsInntektInformasjon: {
            inntektListe: [],
          },
        });
      }
    });
  }

  return data;
};

function Inntekter({ readOnly, visFor }) {
  const [inntektdata, setInntektdata] = useState({
    fraDato: null,
    tilDato: null,
    timestamp: null,
    inntektId: null,
    inntekt: {
      arbeidsInntektMaaned: [],
      ident: {},
      manueltRedigert: false,
    },
  });
  const [arbeidsgivere, setArbeidsgivere] = useState([]);
  const [hentInntektStatus, setHentInntekttatus] = useState(false);
  const [isHentInntektModalOpen, setHentInntektModal] = useState(false);
  const [hentetInntektPåNytt, setHentetInntektPåNytt] = useState(false);

  // todo endre struktur fra backend slik at vi slipper å bruke til å hacke ting på plass
  // DOM order matches the visual order, improving navigation for assistive technology. Learn more.

  useEffect(() => {
    const getInntektFromApi = async () => {
      let resultat;
      try {
        resultat = await getInntekt(visFor);
      } catch (error) {
        throw new Error(
          `En feil har oppstått i forbindelse med tjenestekallet til inntekt. ${error}`
        );
      }
      if (resultat) {
        const data = set36Måneder(resultat);

        setInntektdata(data);
        setArbeidsgivere(await findArbeidsgivere(data.inntekt));
      }
    };

    getInntektFromApi();
  }, [visFor]);

  const fetchUncachedInntekt = async () => {
    setHentInntekttatus("fetching");

    let resultat;
    try {
      resultat = await getUncachedInntekt(
        inntektRequest(new URLSearchParams(location.search))
      );
    } catch (error) {
      throw new Error(
        `En feil har oppstått i forbindelse med tjenestekallet til inntekt. ${error}`
      );
    }

    if (resultat) {
      const data = set36Måneder(resultat);

      setInntektdata({ ...data });
      setArbeidsgivere(await findArbeidsgivere(data.inntekt));
      setHentetInntektPåNytt(true);
    }
    setHentInntekttatus(true);
  };

  if (
    !inntektdata.inntektId &&
    !inntektdata.inntekt.arbeidsInntektMaaned.length
  ) {
    return <Spinner type="XL" />;
  }

  return (
    <>
      <Panel border>
        <div className="flex">
          {inntektdata.inntektsmottaker.pnr && (
            <div className="marginhoyre16">
              {getKjønn(inntektdata.inntektsmottaker.pnr)}
            </div>
          )}
          <div>
            {inntektdata.inntektsmottaker.navn && (
              <Ingress>{inntektdata.inntektsmottaker.navn}</Ingress>
            )}
            {inntektdata.inntektsmottaker.pnr && (
              <Normaltekst>Fødselsnummer</Normaltekst>
            )}
            {inntektdata.inntektsmottaker.pnr && (
              <Ingress>{inntektdata.inntektsmottaker.pnr}</Ingress>
            )}
          </div>

          <div className="flexend flex noprint">
            {inntektdata.manueltRedigert && (
              <div className="marginhoyre16 flex">
                <EditedIkon />
                <Element>Manuelt redigert</Element>
              </div>
            )}
            <Knapp
              htmlType="button"
              mini
              disabled={readOnly}
              onClick={() => sendTilbakemelding()}
            >
              Hvordan opplever du løsningen?
            </Knapp>
          </div>
        </div>
      </Panel>

      <Spacer sixteenPx />

      {hentInntektStatus && (
        <div aria-live="polite">
          <AlertStripe type="info">
            Inntekt innhentet. Trykk bekreft for å lagre.
          </AlertStripe>
          <Spacer sixteenPx />
        </div>
      )}

      <div className="flex hentinntekter">
        <Knapp
          onClick={() => setHentInntektModal(true)}
          autoDisableVedSpinner
          disabled={readOnly}
          spinner={hentInntektStatus === "fetching"}
        >
          Hent inntekter på nytt
        </Knapp>
        <div className="marginvenstre16">
          Opplysninger hentet :
          <Normaltekst>
            {formatDato(new Date(inntektdata.timestamp), DDMMYYYYHHMM_FORMAT)}
            {", "}
            <b>
              {formatDistance(new Date(inntektdata.timestamp), new Date(), {
                locale: nb,
                addSuffix: true,
              })}
            </b>
          </Normaltekst>
        </div>

        <div className="flexend">
          <Flatknapp mini htmlType="button" onClick={() => gåTilForrige12()}>
            {"< 12 mnd"}
          </Flatknapp>
          <Flatknapp mini htmlType="button" onClick={() => gåTilNeste12()}>
            {"12 mnd >"}
          </Flatknapp>
        </div>

        <OkAvbrytModal
          isOpen={isHentInntektModalOpen}
          text="Når du henter inn nyeste inntekt fra skatt så vil alle tidligere endringene gå tapt."
          avbrytCallback={() => setHentInntektModal(false)}
          OkCallback={() => {
            fetchUncachedInntekt();
            setHentInntektModal(false);
          }}
        />
      </div>
      <Spacer sixteenPx />
      <InntektsForm
        readOnly={readOnly}
        hentInntektStatus={hentInntektStatus}
        locationData={inntektRequest(new URLSearchParams(location.search))}
        initialValues={{
          ...inntektdata,
          arbeidsgivere: [...arbeidsgivere],
        }}
        hentetInntektPåNytt
      />
    </>
  );
}

Inntekter.propTypes = {
  readOnly: PropTypes.bool,
  visFor: PropTypes.shape({
    aktørId: PropTypes.string.isRequired,
    vedtakId: PropTypes.string.isRequired,
    beregningsDato: PropTypes.string.isRequired,
  }),
};

Inntekter.defaultProps = { readOnly: false };

export default Inntekter;
