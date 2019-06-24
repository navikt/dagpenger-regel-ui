import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import axios from 'axios';
import { Knapp, Flatknapp } from 'nav-frontend-knapper';
import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst, Ingress } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import { subMonths, formatDistance } from 'date-fns';
import { nb } from 'date-fns/locale';
import Spinner from '../Components/Spinner';
import Spacer from '../Components/Spacer';
import { Inntektstabell } from './Inntektstabell';
import { DDMMYYYYHHMM_FORMAT } from '../Utils/datoFormat';
import { formatDato, eachMonthOfInterval } from '../Utils/datoUtils';
import { OkAvbrytModal } from '../Components/OkAvbrytModal';
import {
  getInntekt, getUncachedInntekt, lagreInntekt,
} from '../lib/inntektApiClient';

import './Dashboard.css';


export const findArbeidsgivere = (inntekt) => {
  const map = new Map();
  inntekt.arbeidsInntektMaaned
    .forEach(mnd => mnd.arbeidsInntektInformasjon.inntektListe
      .forEach((arbeidsgiver) => {
        // TODO fikse denne, bør flyttes til backend ved et senere tidspunkt
        const navn = 'NAVN';

        map.set(arbeidsgiver.virksomhet.identifikator, { navn, ...arbeidsgiver.virksomhet });
      }));

  return Array.from(map.values())
    .sort((a, b) => b.identifikator - a.identifikator);
};


const inntektRequest = queryParams => ({
  aktørId: queryParams.get('aktorId'),
  vedtakId: queryParams.get('vedtakId'),
  beregningsDato: queryParams.get('beregningdato'),
});

// TODO hente bredde dynamisk tilfelle
const gåTilForrige12 = () => {
  const elem = document.getElementById('grid');
  if (elem && (elem.scrollLeft / 3) > 1250) {
    elem.scrollTo({
      top: 0,
      left: elem.scrollLeft - 3250,
      behavior: 'smooth',
    });
  }
};

// TODO hente bredde dynamisk tilfelle
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

const Dashboard = ({ readOnly, location }) => {
  const [inntektdata, setInntektdata] = useState({
    fraDato: null,
    tilDato: null,
    timestamp: null,
    inntektId: '',
    inntekt: {
      arbeidsInntektMaaned: [],
      ident: {},
      manueltRedigert: false,
    },
  });
  const [arbeidsgivere, setArbeidsgivere] = useState([]);
  const [hentInntektStatus, setHentInntekttatus] = useState(false);
  const [isHentInntektModalOpen, setHentInntektModal] = useState(false);

  // todo fra 2016-05 - 2019-05 skal eksludere eller ta(37 måneder) med 2019-05?
  const getAlleMåneder = (fraDato, tilDato) => {
    const måneder = eachMonthOfInterval({
      start: new Date(fraDato),
      end: subMonths(new Date(tilDato), 1),
    });

    return måneder;
  };


  // todo endre struktur fra backend slik at vi slipper å bruke til å hacke ting på plass
  // DOM order matches the visual order, improving navigation for assistive technology. Learn more.

  useEffect(() => {
    const getInntektFromApi = async () => {
      let result;
      if (process.env.NODE_ENV !== 'production') {
        try {
          result = await axios(`${process.env.PUBLIC_URL}/mock/mock.json`);
        } catch (error) {
          throw new Error(`En feil har oppstått i forbindelse med tjenestekallet til inntekt. ${error}`);
        }
      } else {
        try {
          result = await getInntekt(inntektRequest(new URLSearchParams(location.search)));
        } catch (error) {
          throw new Error({
            name: 'NetworkError',
            message: `En feil har oppstått i forbindelse med tjenestekallet til inntekt. ${error}`,
          });
        }
      }

      // todo rydde opp denne funksjonen slik at den ikke trengs å skrives enn gang til
      const { fraDato, tilDato } = (result.data || []).inntekt;
      if (fraDato && tilDato) {
        const måneder = getAlleMåneder(fraDato, tilDato);

        måneder.forEach((måned) => {
          const isMånedEksisterer = result.data.inntekt.arbeidsInntektMaaned.some(inntekt => måned === inntekt.aarMaaned);

          if (!isMånedEksisterer) {
            result.data.inntekt.arbeidsInntektMaaned.push({
              aarMaaned: måned,
              arbeidsInntektInformasjon: {
                inntektListe: [],
              },
            });
          }
        });
      }

      setInntektdata({ ...result.data });
      setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
    };

    getInntektFromApi();
  }, [location.search]);

  const fetchUncachedInntekt = async () => {
    setHentInntekttatus('fetching');

    let result;
    if (process.env.NODE_ENV !== 'production') {
      result = await axios(
        `${process.env.PUBLIC_URL}/mock/mock1.json`,
      );
    } else {
      try {
        result = await getUncachedInntekt(inntektRequest(new URLSearchParams(location.search)));
      } catch (error) {
        throw new Error(`En feil har oppstått i forbindelse med tjenestekallet til inntekt. ${error}`);
      }
    }

    const { fraDato, tilDato } = (result.data || []).inntekt;
    const måneder = getAlleMåneder(fraDato, tilDato);

    måneder.forEach((måned) => {
      const isMånedEksisterer = result.data.inntekt.arbeidsInntektMaaned.some(inntekt => måned === inntekt.aarMaaned);

      if (!isMånedEksisterer) {
        result.data.inntekt.arbeidsInntektMaaned.push({
          aarMaaned: måned,
          arbeidsInntektInformasjon: {
            inntektListe: [],
          },
        });
      }
    });

    setInntektdata({ ...result.data });
    setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
    setHentInntekttatus(true);
  };

  if (!inntektdata.inntekt.arbeidsInntektMaaned.length) {
    return <Spinner type="XL" />;
  }

  return (
    <>
      <Panel border>
        <div className="flex">
          <Ingress>{`Fødselsnr: ${inntektdata.inntekt.ident.identifikator}`}</Ingress>
        </div>
      </Panel>

      <Spacer sixteenPx />

      {hentInntektStatus && (
        <div aria-live="polite">
          <AlertStripe type="info">Inntekt innhentet. Trykk bekreft for å lagre.</AlertStripe>
          <Spacer sixteenPx />
        </div>
      )}

      <div className="flex">
        <Knapp
          onClick={() => setHentInntektModal(true)}
          autoDisableVedSpinner
          disabled={readOnly}
          spinner={hentInntektStatus === 'fetching'}
        >

        Hent inntekter på nytt
        </Knapp>
        <div className="marginvenstre16">
            Opplysninger hentet:
          <Normaltekst>
            {formatDato(new Date(inntektdata.timestamp), DDMMYYYYHHMM_FORMAT)}
            {', '}
            <b>
              {formatDistance(new Date(inntektdata.timestamp), new Date(), { locale: nb, addSuffix: true })}
            </b>
          </Normaltekst>
        </div>

        <div className="flexend">
          <Flatknapp mini htmlType="button" onClick={() => gåTilForrige12()}>{'< 12 mnd'}</Flatknapp>
          <Flatknapp mini htmlType="button" onClick={() => gåTilNeste12()}>{'12 mnd >'}</Flatknapp>
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

      <Formik
        validate
        enableReinitialize
        initialValues={{
          ...inntektdata,
          arbeidsgivere: [
            ...arbeidsgivere,
          ],
        }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            lagreInntekt(values)
              .then((result) => {
                setInntektdata({ ...result.data });
                setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
                actions.setStatus({ success: true });
              })
              // eslint-disable-next-line no-unused-vars
              .catch((error) => {
                actions.setStatus({ failure: true });
              }).finally(() => {
                actions.setSubmitting(false);
              });
          }, 1000);
        }}
        render={formProps => (
          <Inntektstabell
            {...formProps}
            readOnly={readOnly}
            hentInntektStatus={hentInntektStatus}
          />
        )}
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
