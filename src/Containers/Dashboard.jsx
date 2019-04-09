import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

const Dashboard = (location) => {
  // const routeParams = location.match.params;
  // const { aktorId, beregningdato, vilkarid } = routeParams;

  const [data, setData] = useState({ arbeidsInntektMaaned: [], ident: {} });

  const groupByArbeidsgiver = (list) => {
    const map = new Map();
    list.forEach((maaned) => {
      maaned.arbeidsInntektInformasjon.inntektListe.forEach((inntekt) => {
        const arbeidsgiver = inntekt.virksomhet.identifikator;
        const månederForArbeidsgiver = map.get(arbeidsgiver);
        if (!månederForArbeidsgiver) {
          map.set(arbeidsgiver, [inntekt]);
        } else {
          månederForArbeidsgiver.push(inntekt);
        }
      });
    });
    return map;
  };

  useEffect(() => {
    const getMock = async () => {
      const result = await axios(
        'http://localhost:3000/mock/flereinntekter.json',
      );

      setData(result.data);
    };

    getMock();
  });
  return (
    <div>
      {[...groupByArbeidsgiver(data.arbeidsInntektMaaned).entries()].map(val => (
        <div key={val[0]}>
          <Ekspanderbartpanel tittel={val[0]} tittelProps="normaltekst">
            <ul>
              {val[1].map((inntekt => (<li key={inntekt.beloep}>{inntekt.beloep}</li>)))}
            </ul>
          </Ekspanderbartpanel>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
