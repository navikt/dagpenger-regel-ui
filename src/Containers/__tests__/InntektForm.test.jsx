import React from 'react';
import renderer from 'react-test-renderer';
import InntektsForm from '../InntektsForm';
import { findArbeidsgivere } from '../Dashboard';
import inntektMock from '../../../public/mock/mock';

const arbeidsgivere = findArbeidsgivere(inntektMock.inntekt);

const locationData = {
  aktørId: '123',
  vedtakId: '123',
  beregningsDato: '2019-06',
};

describe('InntektsForm', () => {
  xtest('Skal vise ny InntektsForm', () => {
    const component = renderer.create(
      <InntektsForm
        readOnly={false}
        hentInntektStatus={false}
        inntektdata={inntektMock}
        locationData={locationData}
        initialValues={{
          ...inntektMock,
          arbeidsgivere: [
            ...arbeidsgivere,
          ],
        }}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
