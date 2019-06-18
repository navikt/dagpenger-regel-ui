import React from 'react';
import renderer from 'react-test-renderer';
import Dashboard from '../Dashboard';

const location = {
  search: 'http://localhost/inntekter/?aktorId=3_G_INNTEKT&vedtakId=12345&beregningdato=2019-07-01',
};

describe('Dashboard', () => {
  test('Skal vise ny Dashboard med loader', () => {
    const component = renderer.create(
      <Dashboard location={location} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  xtest('Skal vise ny Dashboard', () => {
    const component = renderer.create(
      <Dashboard location={location} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
