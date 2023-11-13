const loadModel = require('./loadModel');
// import { abc } from "./loadModel";

test('adds 1 + 2 to equal 3', () => {
  expect(loadModel.abc(1, 2)).toBe(3);
});
