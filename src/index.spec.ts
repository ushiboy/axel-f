import assert = require('assert');
import { createStore } from './';

describe('createStore', () => {
  describe('dispatch', () => {
    it('xxx', () => {
      const state = {
        greet: {
          message: '',
        },
      };

      const updates = {
        greet: (state, action) => {
          return state;
        },
      };
      const store = createStore(state, updates);
      //assert(true === false);
    });
  });
});
