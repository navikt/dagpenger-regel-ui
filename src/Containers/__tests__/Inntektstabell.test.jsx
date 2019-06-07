import React from 'react';
import renderer from 'react-test-renderer';
import { Inntektstabell, buildCSSGrid } from '../Inntektstabell';
import { findArbeidsgivere } from '../Dashboard';
import { formPropsMock } from '../../Utils/testHelpers';
import inntektMock from '../../../public/mock/mock2';

const myTrim = x => x.replace(/^\s+|\s+$/gm, '');
const arbeidsgivere = findArbeidsgivere(inntektMock.inntekt);
const values = {
  ...inntektMock,
  arbeidsgivere,
};

const formProps = {
  ...formPropsMock,
  values,
};

describe('Inntektstabell', () => {
  test('Skal vise ny Dashboard', () => {
    const component = renderer.create(
      <Inntektstabell {...formProps} readOnly={false} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });


  test('Skal bygge cssgrid', () => {
    const { inntekt } = values;
    const grid = buildCSSGrid(inntekt, arbeidsgivere);
    const template = `.grid {
      grid-template-areas: ". maaned--2016-07 maaned--2016-09 maaned--2016-10 maaned--2016-11 maaned--2016-12 maaned--2017-08 maaned--2017-11 maaned--2017-12 maaned--2018-02 maaned--2018-03 maaned--2018-06 maaned--2018-07 maaned--2018-10 maaned--2018-12 maaned--2019-03 maaned--2019-06 " "arbeidsgiver--873152362 inntekter--873152362--2016-07  inntekter--873152362--2016-09  inntekter--873152362--2016-10  inntekter--873152362--2016-11  inntekter--873152362--2016-12  inntekter--873152362--2017-08  inntekter--873152362--2017-11  inntekter--873152362--2017-12  inntekter--873152362--2018-02  inntekter--873152362--2018-03  inntekter--873152362--2018-06  inntekter--873152362--2018-07  inntekter--873152362--2018-10  inntekter--873152362--2018-12  inntekter--873152362--2019-03  inntekter--873152362--2019-06 ";`;
    expect(myTrim(grid)).toEqual(myTrim(template));
  });
});
