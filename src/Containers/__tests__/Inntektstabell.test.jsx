import React from 'react';
import renderer from 'react-test-renderer';
import { Inntektstabell, buildCSSGrid } from '../Inntektstabell';
import { findArbeidsgivere } from '../Dashboard';
import { formPropsMock } from '../../Utils/testHelpers';
import inntektMock from '../../../public/mock/mock';

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
  // TODO: Figure out how to get local and numberformat pass in CI
  xtest('Skal vise ny Inntektstabell', () => {
    const component = renderer.create(
      <Inntektstabell {...formProps} readOnly={false} hentInntektStatus={false} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });


  xtest('Skal bygge cssgrid', () => {
    const { inntekt } = values;
    const grid = buildCSSGrid(inntekt, arbeidsgivere);
    const template = `.grid {
      grid-template-areas: ". maaned--2017-07 maaned--2017-08 maaned--2017-09 maaned--2017-10 maaned--2017-11 maaned--2017-12 " "arbeidsgiver--1111111 inntekter--1111111--2017-07  inntekter--1111111--2017-08  inntekter--1111111--2017-09  inntekter--1111111--2017-10  inntekter--1111111--2017-11  inntekter--1111111--2017-12 " "arbeidsgiver--222222 inntekter--222222--2017-07  inntekter--222222--2017-08  inntekter--222222--2017-09  inntekter--222222--2017-10  inntekter--222222--2017-11  inntekter--222222--2017-12 ";`;
    expect(myTrim(grid)).toEqual(myTrim(template));
  });
});
