import React from 'react';
import renderer from 'react-test-renderer';
import { Hovedknapp } from 'nav-frontend-knapper';
import { shallow, mount } from 'enzyme';

import NyMaaned, { NyMaanedImpl } from '../NyMaaned';

const arrayHelpers = {};

const setMånedModal = () => {};

const formikPropsMock = {
  // isSubmitting: false,
  // values: {},
  // handleSubmit: noop,
};

describe('Ny måned', () => {
  xtest('submits the form', () => {
    const tree = mount(<NyMaaned closeModal={() => setMånedModal(false)} arrayHelpers={arrayHelpers} {...formikPropsMock} />);
    const button = tree.find(Hovedknapp);
    expect(button).toHaveLength(1);
    expect(button.props().disabled).toBe(false);
    button.simulate('click');
    tree.update();
    // expect(button.props().disabled).toBe(true);

    // simulate submit event. this is always sync! async calls to setState are swallowed.
    // be careful of false positives
    // tree.find(NyMaanedImpl).dive().find('form').simulate('submit', {
    //  preventDefault: () => {}, // no op
    // });

    // Because the simulated event is 100% sync, we can use it to test the synchronous changes
    // here. Any async stuff you do inside handleSubmit will be swallowed. Thus our UI
    // will see the following changes:
    // - isSubmitting -> true (even if you set it to false asynchronously in your handleSubmit)
    // - touched: all fields
    // expect(tree.find(Form).dive().find('#submitting')).toHaveLength(1);
    // expect(tree.find(Form).dive().find('button[type="submit"]').props().disabled).toBe(true);
  });

  test('Skal vise ny skjema for ny måned', () => {
    const component = renderer.create(
      <NyMaaned closeModal={() => setMånedModal(false)} arrayHelpers={arrayHelpers} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
