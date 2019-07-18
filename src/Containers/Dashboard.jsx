import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Knapp, Flatknapp } from 'nav-frontend-knapper';
import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst, Ingress, Element } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import { formatDistance } from 'date-fns';
import { nb } from 'date-fns/locale';
import { showReportDialog, captureException } from '@sentry/browser';
import Spinner from '../Components/Spinner';
import Spacer from '../Components/Spacer';
import InntektsForm from './InntektsForm';
import { DDMMYYYYHHMM_FORMAT } from '../Utils/datoFormat';
import { formatDato, eachMonthOfInterval } from '../Utils/datoUtils';
import { OkAvbrytModal } from '../Components/OkAvbrytModal';
import EditedIkon from '../Components/EditedIkon';
import { ReactComponent as MannIkon } from '../images/mann.svg';
import { ReactComponent as KvinneIkon } from '../images/kvinne.svg';
import { getInntekt, getUncachedInntekt } from '../lib/inntektApiClient';
import { getOrganisasjonsNavn } from '../lib/oppslagApiClient';

const getKjønn = (fødselsnr = '') => {
  if (Number(fødselsnr.charAt(8)) % 2 === 0) {
    return <KvinneIkon />;
  }

  return <MannIkon />;
};

const sendTilbakemelding = () => {
  const eventId = captureException('test');
  showReportDialog({
    eventId,
    title: 'Hvordan opplever du løsningen?',
    subtitle: 'Hjelp  oss å gjøre løsningen bedre. Gi oss tilbakemelding.',
    subtitle2: 'Feil melder du på vanlig måte via Porten.',
    labelName: 'Navn',
    labelEmail: 'E-post',
    labelComments: 'Tilbakemelding',
    labelClose: 'Lukk',
    labelSubmit: 'Send',
    successMessage: 'Takk for tilbakemeldingen.',
  });
};

// slippe denne når vi lager v2 av api dto
export const findArbeidsgivere = async inntekt => {
  const map = new Map();
  inntekt.arbeidsInntektMaaned.forEach(mnd =>
    mnd.arbeidsInntektInformasjon.inntektListe.forEach(arbeidsgiver => {
      const { identifikator } = arbeidsgiver.virksomhet;

      map.set(identifikator, arbeidsgiver.virksomhet);
    }),
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of map.entries()) {
    let resultat;
    if (process.env.NODE_ENV !== 'production') {
      try {
        // eslint-disable-next-line no-await-in-loop
        resultat = await axios(`${process.env.PUBLIC_URL}/mock/mockOrg.json`, {
          validateStatus(status) {
            return status < 500; // Reject only if the status code is greater than or equal to 500
          },
        });
      } catch (error) {
        return null;
        // throw new Error(error);
      }
    } else {
      try {
        resultat = await getOrganisasjonsNavn(key);
      } catch (error) {
        throw new Error(error);
      }
    }
    const { navn } = (resultat || {}).data || {};
    map.set(key, { navn, ...value });
  }

  return Array.from(map.values()).sort((a, b) => b.identifikator - a.identifikator);
};

const inntektRequest = queryParams => ({
  aktørId: queryParams.get('aktorId'),
  vedtakId: queryParams.get('vedtakId'),
  beregningsDato: queryParams.get('beregningdato'),
});

// TODO hente bredde dynamisk tilfelle, bruke useRef
const gåTilForrige12 = () => {
  const elem = document.getElementById('grid');
  if (elem && elem.scrollLeft / 3 > 1250) {
    elem.scrollTo({
      top: 0,
      left: elem.scrollLeft - 3250,
      behavior: 'smooth',
    });
  }
};

// TODO hente bredde dynamisk tilfelle, bruke useRef
const gåTilNeste12 = () => {
  const elem = document.getElementById('grid');
  if (elem && elem.scrollLeft <= 6500) {
    elem.scrollTo({
      top: 0,
      left: elem.scrollLeft + 3250,
      behavior: 'smooth',
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

const set36Måneder = data => {
  const { fraDato, tilDato } = (data || []).inntekt;
  if (fraDato && tilDato) {
    const måneder = getAlleMåneder(fraDato, tilDato);

    if (data.inntekt.arbeidsInntektMaaned === undefined) {
      // eslint-disable-next-line no-param-reassign
      data.inntekt.arbeidsInntektMaaned = [];
    }

    måneder.forEach(måned => {
      const isMånedEksisterer = (data.inntekt.arbeidsInntektMaaned || []).some(inntekt => måned === inntekt.aarMaaned);

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

const Dashboard = ({ readOnly, location }) => {
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

  // todo endre struktur fra backend slik at vi slipper å bruke til å hacke ting på plass
  // DOM order matches the visual order, improving navigation for assistive technology. Learn more.

  useEffect(() => {
    const getInntektFromApi = async () => {
      let resultat;
      if (process.env.NODE_ENV !== 'production') {
        try {
          resultat = await axios(`${process.env.PUBLIC_URL}/mock/mock.json`);
        } catch (error) {
          throw new Error(`En feil har oppstått i forbindelse med tjenestekallet til inntekt. ${error}`);
        }
      } else {
        try {
          resultat = await getInntekt(inntektRequest(new URLSearchParams(location.search)));
        } catch (error) {
          throw new Error(`En feil har oppstått i forbindelse med tjenestekallet til inntekt. ${error}`);
        }
      }
      if (resultat && resultat.data) {
        const data = await set36Måneder(resultat.data);

        setInntektdata(await { ...data });
        setArbeidsgivere(await findArbeidsgivere(data.inntekt));
      }
    };

    getInntektFromApi();
  }, [location.search]);

  const fetchUncachedInntekt = async () => {
    setHentInntekttatus('fetching');

    let resultat;
    if (process.env.NODE_ENV !== 'production') {
      resultat = await axios(`${process.env.PUBLIC_URL}/mock/mock1.json`);
    } else {
      try {
        resultat = await getUncachedInntekt(inntektRequest(new URLSearchParams(location.search)));
      } catch (error) {
        throw new Error(`En feil har oppstått i forbindelse med tjenestekallet til inntekt. ${error}`);
      }
    }

    if (resultat && resultat.data) {
      const data = set36Måneder(resultat.data);

      setInntektdata({ ...data });
      setArbeidsgivere(await findArbeidsgivere(data.inntekt));
    }
    setHentInntekttatus(true);
  };

  if (!inntektdata.inntektId && !inntektdata.inntekt.arbeidsInntektMaaned.length) {
    return <Spinner type="XL" />;
  }

  return (
    <>
      <Panel border>
        <div className="flex">
          {inntektdata.inntektsmottaker.pnr && <div className="marginhoyre16">{getKjønn(inntektdata.inntektsmottaker.pnr)}</div>}
          <div>
            {inntektdata.inntektsmottaker.navn && <Ingress>{inntektdata.inntektsmottaker.navn}</Ingress>}
            {inntektdata.inntektsmottaker.pnr && <Normaltekst>Fødselsnummer</Normaltekst>}
            {inntektdata.inntektsmottaker.pnr && <Ingress>{inntektdata.inntektsmottaker.pnr}</Ingress>}
          </div>

          <div className="flexend flex noprint">
            {inntektdata.manueltRedigert && (
              <div className="marginhoyre16 flex">
                <EditedIkon />
                <Element>Manuelt redigert</Element>
              </div>
            )}
            <Knapp htmlType="button" mini disabled={readOnly} onClick={() => sendTilbakemelding()}>
              Hvordan opplever du løsningen?
            </Knapp>
          </div>
        </div>
      </Panel>

      <Spacer sixteenPx />

      {hentInntektStatus && (
        <div aria-live="polite">
          <AlertStripe type="info">Inntekt innhentet. Trykk bekreft for å lagre.</AlertStripe>
          <Spacer sixteenPx />
        </div>
      )}

      <div className="flex hentinntekter">
        <Knapp onClick={() => setHentInntektModal(true)} autoDisableVedSpinner disabled={readOnly} spinner={hentInntektStatus === 'fetching'}>
          Hent inntekter på nytt
        </Knapp>
        <div className="marginvenstre16">
          Opplysninger hentet :
          <Normaltekst>
            {formatDato(new Date(inntektdata.timestamp), DDMMYYYYHHMM_FORMAT)}
            {', '}
            <b>{formatDistance(new Date(inntektdata.timestamp), new Date(), { locale: nb, addSuffix: true })}</b>
          </Normaltekst>
        </div>

        <div className="flexend">
          <Flatknapp mini htmlType="button" onClick={() => gåTilForrige12()}>
            {'< 12 mnd'}
          </Flatknapp>
          <Flatknapp mini htmlType="button" onClick={() => gåTilNeste12()}>
            {'12 mnd >'}
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
      />
    </>
  );
};

Dashboard.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  readOnly: PropTypes.bool,
};

Dashboard.defaultProps = { readOnly: false };

export default Dashboard;
