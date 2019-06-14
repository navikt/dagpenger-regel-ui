import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import axios from 'axios';
import { Knapp } from 'nav-frontend-knapper';
import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst, Ingress } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import { ToggleKnapp } from 'nav-frontend-toggle';
import Spinner from '../Components/Spinner';
import Spacer from '../Components/Spacer';
import { Inntektstabell } from './Inntektstabell';
import { OkAvbrytModal } from '../Components/OkAvbrytModal';
import {
  getInntekt, getUncachedInntekt, lagreInntekt, getName,
} from '../lib/inntektApiClient';
import { ReactComponent as MannIkon } from '../images/mann.svg';

import './Dashboard.css';

export const findArbeidsgivere = (inntekt) => {
  const map = new Map();
  inntekt.arbeidsInntektMaaned
    .forEach(mnd => mnd.arbeidsInntektInformasjon.inntektListe
      .forEach((arbeidsgiver) => {
        // TODO fikse denne, bør flyttes til backend ved et senere tidspunkt
        const navn = 'test'; // getName(JSON.stringify({ id: arbeidsgiver.virksomhet.identifikator, aktørType: arbeidsgiver.virksomhet.aktoerType }));

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

const Dashboard = ({ readOnly, location }) => {
  const [inntektdata, setInntektdata] = useState({ inntektId: '', inntekt: { arbeidsInntektMaaned: [], ident: {}, manueltRedigert: false } });
  const [arbeidsgivere, setArbeidsgivere] = useState([]);
  const [hentInntektStatus, setHentInntekttatus] = useState(false);
  const [isHentInntektModalOpen, setHentInntektModal] = useState(false);


  useEffect(() => {
    const getInntektFromApi = async () => {
      let result;
      if (process.env.NODE_ENV !== 'production') {
        result = await axios(
          `${process.env.PUBLIC_URL}/mock/mock.json`,
        );
      } else {
        result = await getInntekt(inntektRequest(new URLSearchParams(location.search)));
      }
      setInntektdata({ ...result.data });
      setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
    };

    getInntektFromApi();
  }, [location.search]);

  const fetchUncachedInntekt = async () => {
    setHentInntekttatus('fetching');
    if (process.env.NODE_ENV !== 'production') {
      const result = await axios(
        `${process.env.PUBLIC_URL}/mock/mock1.json`,
      );
      setInntektdata({ ...result.data });
      setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
      setHentInntekttatus(true);
    } else {
      getUncachedInntekt(inntektRequest(new URLSearchParams(location.search)))
        .then((result) => {
          setInntektdata({ ...result.data });
          setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
          setHentInntekttatus(true);
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          setHentInntekttatus('error');
        });
    }
  };

  if (!arbeidsgivere.length || !inntektdata.inntekt.arbeidsInntektMaaned.length) {
    return <Spinner type="XL" />;
  }

  return (
    <>
      <Panel border>
        <div className="flex">
          <MannIkon />
          <div className="paddingleft">
            <Ingress>Ola Nordmann</Ingress>
            <Normaltekst>{`AktørId: ${inntektdata.inntekt.ident.identifikator}`}</Normaltekst>
          </div>
          <div className="flexend hoyre">
            InntektId
            <Normaltekst>{inntektdata.inntektId.id}</Normaltekst>
          </div>
        </div>
      </Panel>

      <Spacer sixteenPx />

      {hentInntektStatus
      && <div aria-live="polite"><AlertStripe type="info">Ny inntekt hentet</AlertStripe></div>}
      {hentInntektStatus === 'error'
      && (
        <div aria-live="polite">
          <AlertStripe type="feil">En feil skjedde under henting av frisk inntekt</AlertStripe>
        </div>
      )}

      <div className="flex">
        <Knapp
          onClick={() => setHentInntektModal(true)}
          autoDisableVedSpinner
          spinner={hentInntektStatus === 'fetching'}
        >

        Hent inntekter på nytt
        </Knapp>

        <OkAvbrytModal
          isOpen={isHentInntektModalOpen}
          text="Når du henter inn nyeste inntekt fra skatt så vil alle endringene dine gå tapt."
          avbrytCallback={() => setHentInntektModal(false)}
          OkCallback={() => {
            fetchUncachedInntekt();
            setHentInntektModal(false);
          }}
        />
        <div className="flexend">
          <ToggleKnapp>Vis alle</ToggleKnapp>
        </div>

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
