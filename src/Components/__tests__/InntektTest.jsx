import React from 'react';
import Inntekt from '../Inntekt';
import renderer from 'react-test-renderer';

const fs = require('fs');
const path = require('path');

/* TODO: Figure out how to get local and numberformat pass in CI
test('No inntekt', () => {
  const component = renderer.create(
    <Inntekt inntekter={[]} readOnly={false} columnId={'1'} rowId={'1'} monthIndex={1} formProps={{}}/>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});


test('Sum inntekt correctly', () => {

  let inntekt = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'inntektliste.json'), 'utf8'));
  const component = renderer.create(
    <Inntekt inntekter={inntekt.inntektListe} readOnly={false} columnId={'1111111'} rowId={'1111111'} monthIndex={1}
             formProps={{}}/>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
}); */
