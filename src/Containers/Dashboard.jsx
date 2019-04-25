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

const findArbeidsgivere = (data) => {
  const map = new Map();
  data.arbeidsInntektMaaned
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
  const queryParams = new URLSearchParams(location.search);
  const aktorId = queryParams.get('aktorId');
  const vedtakId = queryParams.get('vedtakId');
  const beregningsDato = queryParams.get('beregningsDato');
  let inntektApiRequest = {
    aktørId: aktorId,
    vedtakId: vedtakId,
    beregningsDato: beregningsDato
  };

  console.log(readOnly);

  const [data, setData] = useState({ arbeidsInntektMaaned: [], ident: {}, arbeidsgivere: [] });

  useEffect(() => {
    const getMock = async () => {
      if (process.env.NODE_ENV !== "production"){
        const result = await axios(
          process.env.PUBLIC_URL + '/mock/flereinntekter.json',
        );
        setData({ arbeidsgivere: findArbeidsgivere(result.data), ...result.data });
      } else {
        const result = await getInntekt(process.env.PUBLIC_URL, inntektApiRequest);
        setData({ arbeidsgivere: findArbeidsgivere(result.data.inntekt), ...result.data.inntekt});
      }

    };

    getMock();
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
