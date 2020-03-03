import React from 'react';
import renderer from 'react-test-renderer';
import ResizeBox from '../';

test('render', () => {
  expect(() => renderer.create(<ResizeBox />)).not.toThrow();
});
