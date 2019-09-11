import React from 'react';
import renderer from 'react-test-renderer';
import InntektsForm from '../InntektsForm';

const person = {
  aktørId: '123',
  vedtakId: '123',
  beregningsDato: '2019-06',
};

const inntekter = {};

const måneder = {};

describe('InntektsForm', () => {
  xtest('Skal vise ny InntektsForm', () => {
    const component = renderer.create(
      <InntektsForm
        initialValues={{
          person: {
            ...person,
            vedtak: {
              ...person.vedtak,
              inntekt: {
                ...person.vedtak.inntekt,
                posteringer: [...inntekter],
              },
            },
          },
        }}
        hentInntektStatus={false}
        måneder={måneder}
        readOnly={false}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
