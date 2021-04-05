import assert = require('assert');
import { createStore, combine } from './';

describe('simple flow', () => {
  const GREET = 'hello@greet';
  const ASYNC_GREET = 'hello@asyncGreet';

  type GreetAction = {
    type: typeof GREET;
  };
  type AsyncGreetAction = {
    type: typeof ASYNC_GREET;
    payload: {
      name: string;
    };
  };
  type GreetActions = GreetAction | AsyncGreetAction;

  type GreetState = {
    message: string;
  };

  const greet = (): GreetAction => ({
    type: GREET,
  });
  const asyncGreet = (name: string): AsyncGreetAction => ({
    type: ASYNC_GREET,
    payload: {
      name,
    },
  });
  it('xxx', async () => {
    const state = {
      message: '',
    };

    const update = (
      state: GreetState,
      action: GreetActions
    ): GreetState | Promise<GreetState> => {
      switch (action.type) {
        case GREET: {
          return { ...state, message: 'hello' };
        }
        case ASYNC_GREET: {
          const { name } = action.payload;
          return Promise.resolve({ ...state, message: `hello ${name}` });
        }
      }
      return state;
    };
    const store = createStore(state, update);
    await store.dispatch(greet());
    assert(store.getState().message === 'hello');

    await store.dispatch(asyncGreet('world'));
    assert(store.getState().message === 'hello world');
  });
});

describe('reduce flow', () => {
  const GREET = 'hello@greet';
  const ASYNC_GREET = 'hello@asyncGreet';

  type GreetAction = {
    type: typeof GREET;
  };
  type AsyncGreetAction = {
    type: typeof ASYNC_GREET;
    payload: {
      name: string;
    };
  };
  type GreetActions = GreetAction | AsyncGreetAction;

  type GreetState = {
    message: string;
  };

  type AppState = {
    greet: GreetState;
  };

  const greet = (): GreetAction => ({
    type: GREET,
  });
  const asyncGreet = (name: string): AsyncGreetAction => ({
    type: ASYNC_GREET,
    payload: {
      name,
    },
  });
  it('xxx', async () => {
    const state = {
      greet: {
        message: '',
      },
    };

    const update = (
      state: GreetState,
      action: GreetActions
    ): GreetState | Promise<GreetState> => {
      switch (action.type) {
        case GREET: {
          return { ...state, message: 'hello' };
        }
        case ASYNC_GREET: {
          const { name } = action.payload;
          return Promise.resolve({ ...state, message: `hello ${name}` });
        }
      }
      return state;
    };
    const store = createStore(
      state,
      combine({
        greet: update,
      })
    );
    await store.dispatch(greet());
    assert(store.getState().greet.message === 'hello');

    await store.dispatch(asyncGreet('world'));
    assert(store.getState().greet.message === 'hello world');
  });
});
