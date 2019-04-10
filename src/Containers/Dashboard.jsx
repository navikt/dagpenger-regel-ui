import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Arbeidsgiver from '../Components/Arbeidsgiver';
import Maaned from '../Components/Maaned';
import Inntekt from '../Components/Inntekt';

import './Dashboard.css';

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
        {data.arbeidsgivere.map(arbeidsgiver => (
          <Arbeidsgiver key={arbeidsgiver.identifikator} arbeidsgiver={arbeidsgiver} />
        ))}

      </div>
      <div className="maaneder">
        {data.arbeidsInntektMaaned.map(maaned => (
          <div key={maaned.aarMaaned}>
            <Maaned maaned={maaned.aarMaaned} />
            {data.arbeidsgivere.map((arbeidsgiver) => {
              const inntekter = maaned.arbeidsInntektInformasjon.inntektListe
                .filter(inntekt => inntekt.virksomhet.identifikator === arbeidsgiver.identifikator);
              return (
                <Inntekt
                  rowId={arbeidsgiver.identifikator}
                  columnId={maaned.aarMaaned}
                  key={arbeidsgiver.identifikator}
                  inntekter={inntekter}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
