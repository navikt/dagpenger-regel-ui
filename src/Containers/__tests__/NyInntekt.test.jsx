import React from 'react';
import renderer from 'react-test-renderer';
import NyInntekt from '../NyInntekt';

const arrayHelpers = {

};

const virksomhet = {
  identifikator: '1234567890',
  aktoerType: 'ORGANISASJON',
};

const setModal = () => {

};
describe('NyInntekt', () => {
  xtest('Skal vise ny inntektspost', () => {
    const component = renderer.create(
      <NyInntekt virksomhet={virksomhet} dato="2019-05" arrayHelpers={arrayHelpers} closeModal={() => setModal(false)} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
