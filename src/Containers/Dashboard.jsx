import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = (location) => {
  // const routeParams = location.match.params;
  // const { aktorId, beregningdato, vilkarid } = routeParams;

  const [data, setData] = useState({ arbeidsInntektMaaned: [], ident: {} });

  useEffect(() => {
    const getMock = async () => {
      const result = await axios(
        'http://localhost:3000/mock/inntekter.json',
      );

      setData(result.data);
    };

    getMock();
  });

  return (
    <div>
      {data.arbeidsInntektMaaned.map(maaned => (
        <div key={maaned.aarMaaned}>
          {maaned.aarMaaned}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
