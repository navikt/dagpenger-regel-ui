import React from 'react';
import renderer from 'react-test-renderer';
import NyInntekt from '../NyInntekt';

const arrayHelpers = {

};

const setModal = () => {

};

test('Skal vise ny inntektspost', () => {
  const component = renderer.create(
    <NyInntekt arbeidsgiver="9876543210" dato="2019-05" arrayHelpers={arrayHelpers} closeModal={() => setModal(false)} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
