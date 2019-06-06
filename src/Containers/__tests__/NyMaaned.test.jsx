import React from 'react';
import renderer from 'react-test-renderer';
import { Hovedknapp } from 'nav-frontend-knapper';
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
import { noop } from '../../lib/testHelpers';


import NyMaaned from '../NyMaaned';

const shallow = new ShallowRenderer();

const arrayHelpers = {};

const setMånedModal = () => {};
const InitialValues = { name: 'jared' };

test('Skal vise ny skjema for ny måned', () => {
  const component = renderer.create(
    <NyMaaned closeModal={() => setMånedModal(false)} arrayHelpers={arrayHelpers} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

xtest('Skal sende inn ny måned', () => {
  /*
  const component = renderer.create(
    withFormik({
      mapPropsToValues: () => InitialValues,
      handleSubmit: noop,
    })(<NyMaaned closeModal={() => setMånedModal(false)} arrayHelpers={arrayHelpers} />),
  );
  console.log(component.mount);
  // const { root } = component;
  const button = root.findByType(Hovedknapp);

  expect(root.props.submitCount).toBe(0);
  expect(root.props.isSubmitting).toBe(false);
  button.props.onClick();
  expect(root.props.submitCount).toBe(1);
  expect(root.props.isSubmitting).toBe(true);
  */

  const component = shallow.render(
    <NyMaaned closeModal={() => setMånedModal(false)} arrayHelpers={arrayHelpers} />,
  );
  console.log(component.WrappedComponent);
  const button = component.find(Hovedknapp);
  console.log(button);
  expect(component.props.submitCount).toBe(0);
  expect(component.props.isSubmitting).toBe(false);
  button.props.onClick();
  expect(component.props.submitCount).toBe(1);
  expect(component.props.isSubmitting).toBe(true);
});
