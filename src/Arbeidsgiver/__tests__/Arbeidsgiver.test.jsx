import React from 'react';
import renderer from 'react-test-renderer';

import { EtikettLiten } from 'nav-frontend-typografi';
import aktørTyper from '../../Kodeverk/aktoerTyper';
import Arbeidsgiver from '../Arbeidsgiver';

const arbeidsgiver = {
  navn: 'Sopra Steria',
  identifikator: '123456789',
  __typename: aktørTyper.ORGANISASJON,
};

describe('Arbeidsgiver', () => {
  test('Skal vise arbeidsgiver', () => {
    const component = renderer.create(<Arbeidsgiver arbeidsgiver={arbeidsgiver} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Skal vise Org. nr da dette er en organisasjon', () => {
    const component = renderer.create(<Arbeidsgiver arbeidsgiver={arbeidsgiver} />);
    expect(component.root.findByType(EtikettLiten).props.children).toEqual('Org. nr');
    // expect(component.root.children).toEqual(['mai 2019']);
  });
});
