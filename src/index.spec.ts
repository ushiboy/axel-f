import assert = require('assert');
import { createStore } from './';


const GREET = 'hello@greet';

type GreetAction = {
  type: typeof GREET;
};

type GreetActions = GreetAction

type GreetState = {
  message: string
}

const greet = (): GreetAction => ({
  type: GREET
});

describe('createStore', () => {
  it('xxx', async () => {
    const state = {
      greet: {
        message: '',
      },
    };

    const updates = {
      greet: (state: GreetState, action: GreetActions) => {
        switch (action.type) {
          case GREET: {
            return { ...state, message: "hello" };
          }
        }
        return state;
      },
    };
    const store = createStore(state, updates);
    await store.dispatch(greet());
    assert(store.getState().greet.message === "hello");
  });
});
