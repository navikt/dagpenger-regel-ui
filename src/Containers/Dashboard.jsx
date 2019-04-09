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
    <div className="container">
      <div className="grid">
        <div className="item ident">
        dfdfd
        </div>
        {data.arbeidsInntektMaaned.map(maaned => (
          <div key={maaned.aarMaaned} className="item">
            {maaned.aarMaaned}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
