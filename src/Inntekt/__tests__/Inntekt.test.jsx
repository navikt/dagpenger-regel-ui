import React from 'react';
import renderer from 'react-test-renderer';
import Inntekt from '../Inntekt';

test('Something', () => {
  const a = 'a';
  expect(a).toEqual('a');
});

// TODO: Figure out how to get local and numberformat pass in CI
xtest('Ingen inntekt', () => {
  const component = renderer.create(<Inntekt inntekter={[]} readOnly={false} columnId="1" rowId="1" monthIndex={1} formProps={{}} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

xtest('Summer inntekter riktig', () => {
  const inntekt = {}; // JSON.parse(fs.readFileSync(path.resolve(__dirname, 'inntektliste.json'), 'utf8'));
  const component = renderer.create(
    <Inntekt inntekter={inntekt.inntektListe} readOnly={false} columnId="1111111" rowId="1111111" monthIndex={1} formProps={{}} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
