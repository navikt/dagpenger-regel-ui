import React from 'react';
import Inntekt from '../Inntekt';
import renderer from 'react-test-renderer';

const fs = require('fs');
const path = require('path');


test('No inntekt', () => {
  const component = renderer.create(
    <Inntekt inntekter={[]} readOnly={false} columnId={'1'} rowId={'1'} monthIndex={1} formProps={{}}/>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});


test('Sum inntekt correctly', () => {

  let inntekt = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'inntektliste.json'), 'utf8'));
  const toLocaleString = Number.prototype.toLocaleString;
  // eslint-disable-next-line no-extend-native
  Number.prototype.toLocaleString = function(locale = 'nb-NO', ...args) {
    return toLocaleString.call(this, locale, ...args);
  };
  const component = renderer.create(
    <Inntekt inntekter={inntekt.inntektListe} readOnly={false} columnId={'1111111'} rowId={'1111111'} monthIndex={1}
             formProps={{}}/>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
