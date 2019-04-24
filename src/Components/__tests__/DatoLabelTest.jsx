import React from 'react';
import DatoLabel from '../DatoLabel';
import renderer from 'react-test-renderer';
import {MMMM_YYYY_FORMAT} from "../../Utils/datoFormat";


test('Dato label with MMMM_YYYY_FORMAT', () => {
  const component = renderer.create(
    <DatoLabel dato={'2019-05'} datoFormat={MMMM_YYYY_FORMAT}/>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});
