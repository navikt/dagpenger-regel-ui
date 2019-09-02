import React from 'react';
import renderer from 'react-test-renderer';
import NyPostering from '../NyPostering';
import aktørTyper from '../../Kodeverk/aktoerTyper';

const arrayHelpers = {};

const virksomhet = {
  navn: 'Sopra Steria',
  identifikator: '123456789',
  __typename: aktørTyper.ORGANISASJON,
};

const setModal = () => {};
describe('NyPostering', () => {
  xtest('Skal vise ny postering', () => {
    const component = renderer.create(<NyPostering virksomhet={virksomhet} dato="2019-05" arrayHelpers={arrayHelpers} closeModal={() => setModal(false)} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
