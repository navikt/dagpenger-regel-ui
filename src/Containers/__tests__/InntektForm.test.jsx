import React from 'react';
import renderer from 'react-test-renderer';
import InntektForm from '../InntektForm';
import { findArbeidsgivere } from '../Dashboard';
import inntektMock from '../../../public/mock/mock';

const arbeidsgivere = findArbeidsgivere(inntektMock.inntekt);

const locationData = {
  aktørId: '123',
  vedtakId: '123',
  beregningsDato: '2019-06',
};

describe('InntektForm', () => {
  xtest('Skal vise ny InntektForm', () => {
    const component = renderer.create(
      <InntektForm
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
