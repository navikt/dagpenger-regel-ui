import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Undertittel, Element, EtikettLiten } from 'nav-frontend-typografi';

import './Dashboard.css';

const findArbeidsgivere = (data) => {
  const map = new Map();
  data.arbeidsInntektMaaned
    .forEach(mnd => mnd.arbeidsInntektInformasjon.arbeidsgivere
      .forEach((arbeidsgiver) => { map.set(arbeidsgiver.identifikator, arbeidsgiver); }));

  return Array.from(map.values())
    .sort((first, second) => second.identifikator - first.identifikator);
};

const Dashboard = (location) => {
  // const routeParams = location.match.params;
  // const { aktorId, beregningdato, vilkarid } = routeParams;

  const [data, setData] = useState({ arbeidsInntektMaaned: [], ident: {}, arbeidsgivere: [] });

  useEffect(() => {
    const getMock = async () => {
      const result = await axios(
        'http://localhost:3000/mock/flereinntekter.json',
      );

      setData({ arbeidsgivere: findArbeidsgivere(result.data), ...result.data });
    };

    getMock();
  }, []);

  return (
    <div className="grid">

      <div className="arbeidsgivere">
        <div className="item nav">
          &laquo; &raquo;
        </div>
        <div className="item arbeidsgiver">
          <Undertittel>Bacon AS</Undertittel>
          <EtikettLiten>Org nr</EtikettLiten>
          <Element>910047388</Element>

        </div>
        <div className="item arbeidsgiver">
          <Undertittel>Bacon AS</Undertittel>
          <EtikettLiten>Org nr</EtikettLiten>
          <Element>910047388</Element>

        </div>
        <div className="item arbeidsgiver">
          <Undertittel>Bacon AS</Undertittel>
          <EtikettLiten>Org nr</EtikettLiten>
          <Element>910047388</Element>

        </div>
        <div className="item arbeidsgiver">
          <Undertittel>Bacon AS</Undertittel>
          <EtikettLiten>Org nr</EtikettLiten>
          <Element>910047388</Element>

        </div>
      </div>
      <div className="maaneder">
        {data.arbeidsInntektMaaned.map(maaned => (
          <div key={maaned.aarMaaned} className="maaned">
            <div className="item maanednavn">
              <Element>{maaned.aarMaaned}</Element>
            </div>
            {maaned.arbeidsInntektInformasjon.arbeidsgivere.map(arbeidsgiver => (
              <div key={1} className="item inntekter">
                {arbeidsgiver.inntektListe.map(inntekt => (
                  <div key={1} className={`inntekt ${arbeidsgiver.identifikator}`}>

                    <EtikettLiten>{inntekt.header}</EtikettLiten>
                    <Element>{inntekt.beloep}</Element>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
