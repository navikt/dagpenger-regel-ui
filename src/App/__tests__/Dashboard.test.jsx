import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';
import { loader } from 'graphql.macro';
import Spinner from '../../Components/Spinner';
import Dashboard from '../Dashboard';

const GET_INNTEKT = loader('../../Graphql/GET_INNTEKT.gql');

const location = {
  search: 'http://localhost/inntekter/?aktorId=3_G_INNTEKT&vedtakId=12345&beregningdato=2019-07-01',
};

const inntektRequest = queryParams => ({
  personId: queryParams.get('aktorId'),
  vedtakId: queryParams.get('vedtakId'),
  beregningsdato: queryParams.get('beregningdato'),
});

const mocks = [
  {
    request: {
      query: GET_INNTEKT,
      variables: { ...inntektRequest(new URLSearchParams(location.search)) },
    },
    result: {
      data: {
        dog: { id: '1', name: 'Buck', breed: 'bulldog' },
      },
    },
  },
];

describe('Dashboard', () => {
  test('Skal vise ny Dashboard med loader', () => {
    const component = renderer.create(
      <MockedProvider mocks={[]} addTypename={false}>
        <Dashboard location={location} />
      </MockedProvider>,
    );
    const tree = component.toJSON();

    const spinner = renderer.create(<Spinner type="XL" />);

    expect(tree).toEqual(spinner.toJSON());
  });

  test('Skal vise ny Dashboard', () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard location={location} />
      </MockedProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
