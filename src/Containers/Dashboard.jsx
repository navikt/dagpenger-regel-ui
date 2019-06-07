import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import axios from 'axios';
import { Knapp } from 'nav-frontend-knapper';
import AlertStripe from 'nav-frontend-alertstriper';
import Spinner from '../Components/Spinner';
import { Inntektstabell } from './Inntektstabell';
import { getInntekt, getUncachedInntekt, lagreInntekt } from '../lib/inntektApiClient';
import './Dashboard.css';

export const findArbeidsgivere = (inntekt) => {
  const map = new Map();
  inntekt.arbeidsInntektMaaned
    .forEach(mnd => mnd.arbeidsInntektInformasjon.inntektListe
      .forEach((arbeidsgiver) => {
        map.set(arbeidsgiver.virksomhet.identifikator, arbeidsgiver.virksomhet);
      }));

  return Array.from(map.values())
    .sort((first, second) => second.identifikator - first.identifikator);
};


const inntektRequest = queryParams => ({
  aktørId: queryParams.get('aktorId'),
  vedtakId: queryParams.get('vedtakId'),
  beregningsDato: queryParams.get('beregningdato'),
});

const Dashboard = ({ readOnly, location }) => {
  const [data, setData] = useState({ inntektId: '', inntekt: { arbeidsInntektMaaned: [], ident: {} } });
  const [arbeidsgivere, setArbeidsgivere] = useState([]);
  const [uncachedStatus, setUncachedStatus] = useState('');


  useEffect(() => {
    const getInntektFromApi = async () => {
      let result;
      if (process.env.NODE_ENV !== 'production') {
        result = await axios(
          `${process.env.PUBLIC_URL}/mock/mock2.json`,
        );
      } else {
        result = await getInntekt(inntektRequest(new URLSearchParams(location.search)));
      }
      setData({ ...result.data });
      setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
    };

    getInntektFromApi();
  }, [location.search]);

  const fetchUncachedInntekt = async () => {
    setUncachedStatus('fetching');
    if (process.env.NODE_ENV !== 'production') {
      const result = await axios(
        `${process.env.PUBLIC_URL}/mock/inntekter.json`,
      );
      setData({ ...result.data });
      setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
      setUncachedStatus('success');
    } else {
      getUncachedInntekt(inntektRequest(new URLSearchParams(location.search)))
        .then((result) => {
          setData({ ...result.data });
          setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
          setUncachedStatus('success');
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          setUncachedStatus('error');
        });
    }
  };

  if (!arbeidsgivere.length || !data.inntekt.arbeidsInntektMaaned.length) {
    return <Spinner type="XL" />;
  }
  // TODO ingen behov settimeout lenger, bruk async og await

  return (
    <>

      {uncachedStatus === 'success'
      && <div aria-live="polite"><AlertStripe type="suksess">Ny inntekt hentet</AlertStripe></div>}
      {uncachedStatus === 'error'
      && (
        <div aria-live="polite">
          <AlertStripe type="feil">En feil skjedde under henting av frisk inntekt</AlertStripe>
        </div>
      )}
      <div>{`AktørId: ${data.inntekt.ident.identifikator}`}</div>

      <Knapp
        mini
        onClick={fetchUncachedInntekt}
        autoDisableVedSpinner
        spinner={uncachedStatus === 'fetching'}
      >
        Oppfrisk inntekt
      </Knapp>
      <Formik
        enableReinitialize
        initialValues={{
          ...data,
          arbeidsgivere: [
            ...arbeidsgivere,
          ],
        }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            lagreInntekt(values)
              .then((result) => {
                setData({ ...result.data });
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
        render={formProps => <Inntektstabell {...formProps} readOnly={readOnly} />}
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
