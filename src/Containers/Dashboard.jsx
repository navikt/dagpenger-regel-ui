import React, {useEffect, useState} from 'react';
import {Form, Formik} from 'formik';
import Arbeidsgiver from '../Components/Arbeidsgiver';
import Maaned from '../Components/Maaned';
import Inntekt from '../Components/Inntekt';
import axios from 'axios';

import './Dashboard.css';
import '../PropTypes/dashBoardPropType';
import dashboardPropType from '../PropTypes/dashBoardPropType';
import getInntekt from '../lib/inntektApiClient'

const findArbeidsgivere = (inntekt) => {
  const map = new Map();
  inntekt.arbeidsInntektMaaned
    .forEach(mnd => mnd.arbeidsInntektInformasjon.inntektListe
      .forEach((arbeidsgiver) => {
        map.set(arbeidsgiver.virksomhet.identifikator, arbeidsgiver.virksomhet);
      }));

  return Array.from(map.values())
    .sort((first, second) => second.identifikator - first.identifikator);
};

const mapToFieldValues = (data) => {
  const x = data.arbeidsInntektMaaned.reduce((acc, maaned) => (
    {
      ...acc,
      ...maaned.arbeidsInntektInformasjon.inntektListe
        .reduce((acc2, inntekt) => ({ ...acc2, ...{ [`${inntekt.virksomhet.identifikator}_${maaned.aarMaaned}_${inntekt.beskrivelse}`]: inntekt.beloep } }), {}),
    }), {});
  return x;
};

const Dashboard = ({ readOnly, location }) => {
  const [data, setData] = useState({ arbeidsInntektMaaned: [], ident: {}, arbeidsgivere: [] });

  useEffect(() => {
    let queryParams = new URLSearchParams(location.search);
    let aktorId = queryParams.get('aktorId');
    let vedtakId = queryParams.get('vedtakId');
    let beregningsDato = queryParams.get('beregningsDato');

    let inntektApiRequest = {
      aktørId: aktorId,
      vedtakId: vedtakId,
      beregningsDato: beregningsDato
    };
    const getInntektFromApi = async () => {
      if (process.env.NODE_ENV !== "production"){
        const result = await axios(
          process.env.PUBLIC_URL + '/mock/flereinntekter.json',
        );
        setData({ arbeidsgivere: findArbeidsgivere(result.data.inntekt), ...result.data.inntekt });
      } else {
        const result = await getInntekt(process.env.PUBLIC_URL, inntektApiRequest);
        setData({ arbeidsgivere: findArbeidsgivere(result.data.inntekt), ...result.data.inntekt});
      }

    };

    getInntektFromApi();
    // console.log(data.arbeidsinntektMaaned[0].arbeidsInntektInformasjon.inntektListe[0].beloep)
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={mapToFieldValues(data)}
      onSubmit={undefined}
    >
      <Form>
        <div className="grid">
          {data.arbeidsgivere.map(arbeidsgiver => (
            <Arbeidsgiver key={arbeidsgiver.identifikator} arbeidsgiver={arbeidsgiver} />
          ))}

          {data.arbeidsInntektMaaned.map(maaned => (
            <>
              <Maaned key={maaned.aarMaaned} maaned={maaned.aarMaaned} />
              {data.arbeidsgivere.map((arbeidsgiver) => {
                const inntekter = maaned.arbeidsInntektInformasjon.inntektListe
                  .filter(inntekt => inntekt.virksomhet.identifikator === arbeidsgiver.identifikator);
                return (
                  <Inntekt
                    readOnly={readOnly}
                    rowId={arbeidsgiver.identifikator}
                    columnId={maaned.aarMaaned}
                    key={arbeidsgiver.identifikator}
                    inntekter={inntekter}
                  />
                );
              })}
            </>
          ))}
        </div>
      </Form>
    </Formik>
  );
};

Dashboard.propTypes = dashboardPropType;
Dashboard.defaultProps = { readOnly: false };

export default Dashboard;
