import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Dashboard.css';

const Dashboard = (location) => {
  // const routeParams = location.match.params;
  // const { aktorId, beregningdato, vilkarid } = routeParams;

  const [data, setData] = useState({ arbeidsInntektMaaned: [], ident: {} });

  useEffect(() => {
    const getMock = async () => {
      const result = await axios(
        'http://localhost:3000/mock/flereinntekter.json',
      );

      setData(result.data);
    };

    getMock();
  }, []);


  return (
    <div className="grid">
      <div className="arbeidsgivere">
        arbeidsgivere
      </div>
      {data.arbeidsInntektMaaned.map(maaned => (
        <div className="maaned">
          <div key={maaned.aarMaaned} className="--navn">
            {maaned.aarMaaned}
          </div>
          {maaned.arbeidsInntektInformasjon.arbeidsgivere.map(arbeidsgiver => (
            <div key={1} className="inntekter">
              {arbeidsgiver.inntektListe.map(inntekt => (
                <div key={1} className="inntekt">
                  Inntekt
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
