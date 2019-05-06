import React, {useEffect, useState} from 'react';
import {Form, Formik} from 'formik';
import Arbeidsgiver from '../Components/Arbeidsgiver';
import Maaned from '../Components/Maaned';
import Inntekt from '../Components/Inntekt';
import axios from 'axios';

import './Dashboard.css';
import '../PropTypes/dashBoardPropType';
import dashboardPropType from '../PropTypes/dashBoardPropType';
import {getInntekt, lagreInntekt} from "../lib/inntektApiClient";
import {Knapp} from "nav-frontend-knapper";

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

const submitInntektToApi = async (data) => {
  await lagreInntekt(process.env.PUBLIC_URL, data);
};

const Dashboard = ({readOnly, location}) => {
  const [data, setData] = useState({inntektId: '', inntekt: {arbeidsInntektMaaned: [], ident: {}}});
  const [arbeidsgivere, setArbeidsgivere] = useState([]);

  useEffect(() => {
    let queryParams = new URLSearchParams(location.search);
    let inntektApiRequest = {
      aktørId: queryParams.get('aktorId'),
      vedtakId: queryParams.get('vedtakId'),
      beregningsDato: queryParams.get('beregningdato'),
    };
    const getInntektFromApi = async () => {
      let result;
      if (process.env.NODE_ENV !== "production") {
        result = await axios(
          process.env.PUBLIC_URL + '/mock/flereinntekter.json',
        );
      } else {
        result = await getInntekt(process.env.PUBLIC_URL, inntektApiRequest);
      }
      setData({...result.data});
      setArbeidsgivere(findArbeidsgivere(result.data.inntekt))
    };

    getInntektFromApi();
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      onSubmit={submitInntektToApi}
      render={props =>
        <Form>
          <div className="grid">
            {arbeidsgivere.map(arbeidsgiver => (
              <Arbeidsgiver key={arbeidsgiver.identifikator} arbeidsgiver={arbeidsgiver}/>
            ))}
            {props.values.inntekt.arbeidsInntektMaaned.map((maaned, monthIndex) => (
              <>
                <Maaned key={maaned.aarMaaned} maaned={maaned.aarMaaned}/>
                {arbeidsgivere.map((arbeidsgiver) => {
                  return (
                    <Inntekt
                      readOnly={readOnly}
                      rowId={arbeidsgiver.identifikator}
                      columnId={maaned.aarMaaned}
                      key={arbeidsgiver.identifikator}
                      inntekter={maaned.arbeidsInntektInformasjon.inntektListe}
                      monthIndex={monthIndex}
                    />
                  );
                })}
              </>
            ))}
          </div>
          <Knapp htmlType="submit">
            Lagre
          </Knapp>
        </Form>
      }
    />
  );
};

Dashboard.propTypes = dashboardPropType;
Dashboard.defaultProps = {readOnly: false};

export default Dashboard;
