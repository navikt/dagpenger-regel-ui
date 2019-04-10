import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Undertittel, Element, EtikettLiten } from 'nav-frontend-typografi';

import Arbeidsgiver from '../Components/Arbeidsgiver';

import './Dashboard.css';

const findArbeidsgivere = (data) => {
  const map = new Map();
  data.arbeidsInntektMaaned
    .forEach(mnd => mnd.arbeidsInntektInformasjon.inntektListe
      .forEach((arbeidsgiver) => { map.set(arbeidsgiver.virksomhet.identifikator, arbeidsgiver.virksomhet); }));

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

  // TODO lage komponenter for de ulike visningene, arbeidsgiver, inntekt osv

  return (
    <div className="grid">

      <div className="arbeidsgivere">
        <div className="item nav">
          &laquo; &raquo;
        </div>
        {data.arbeidsgivere.map(arbeidsgiver => (
          <Arbeidsgiver arbeidsgiver={arbeidsgiver} />
        ))}

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
