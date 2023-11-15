import { loadModel, abc } from './../loadModel'
import {jest} from '@jest/globals';

test('adds 1 + 2 to equal 3', () => {
    expect(abc(1, 2)).toBe(3);
});


