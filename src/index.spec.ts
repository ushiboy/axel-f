import assert = require('assert');
import { createStore, combine, UpdateResult } from './';

const GREET = 'hello@greet';
const ASYNC_GREET = 'hello@asyncGreet';

const INCREMENT = 'count@increment';
const DECREMENT = 'count@ddecrement';

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

type IncrementAction = {
  type: typeof INCREMENT;
};
type DecrementAction = {
  type: typeof DECREMENT;
};
type CountActions = IncrementAction | DecrementAction;

type GreetState = {
  message: string;
};

type CountState = {
  count: number;
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

const increment = (): IncrementAction => ({
  type: INCREMENT,
});

const decrement = (): DecrementAction => ({
  type: DECREMENT,
});

const updateGreet = (
  state: GreetState,
  action: GreetActions
): UpdateResult<GreetState> => {
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

const updateCounter = (
  state: CountState,
  action: CountActions
): UpdateResult<CountState> => {
  switch (action.type) {
    case INCREMENT: {
      return { ...state, count: state.count + 1 };
    }
    case DECREMENT: {
      return { ...state, count: state.count - 1 };
    }
  }
  return state;
};

describe('axel-f', () => {
  context('Simple state case', () => {
    it('will change its status according to the action taken', async () => {
      const state = {
        message: '',
      };

      const store = createStore(state, updateGreet);
      await store.dispatch(greet());
      assert(store.getState().message === 'hello');

      await store.dispatch(asyncGreet('world'));
      assert(store.getState().message === 'hello world');
    });
  });

  context('Multiple state case', () => {
    type AppState = {
      greet: GreetState;
      counter: CountState;
    };

    it('will change its status according to the action taken', async () => {
      const state = {
        greet: {
          message: '',
        },
        counter: {
          count: 0,
        },
      };

      const store = createStore(
        state,
        combine({
          greet: updateGreet,
          counter: updateCounter,
        })
      );
      await store.dispatch(greet());
      assert(store.getState().greet.message === 'hello');

      await store.dispatch(asyncGreet('world'));
      assert(store.getState().greet.message === 'hello world');

      await store.dispatch(increment());
      assert(store.getState().counter.count === 1);

      await store.dispatch(increment());
      assert(store.getState().counter.count === 2);

      await store.dispatch(decrement());
      assert(store.getState().counter.count === 1);
    });
  });
});
