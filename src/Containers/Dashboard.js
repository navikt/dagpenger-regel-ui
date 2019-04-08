import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = (
  location,
) => {
  const routeParams = location.match.params;
  const b = 'dsfdsfdsfd';
  const { aktorId, beregningdato, vilkarid } = routeParams;

  const [data, setData] = useState({ inntekter: {} });

  useEffect(async () => {
    const result = await axios(
      'http://localhost:3000/mock/inntekter.json',
    );

    setData(result.data);
  });

  return (
    <div />
  );
};

export default Dashboard;
