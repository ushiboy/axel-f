/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Action<T = any> {
  type: T;
}

export interface AnyAction extends Action {
  [props: string]: any;
}

export type Update<S, A extends Action = AnyAction> = (
  state: S,
  action: A
) => S | Promise<S>;

export type StateUpdates<S, A extends Action = AnyAction> = {
  [K in keyof S]: Update<S[K], A>;
};

export type Subscriber = () => void;
export type UnSubscriber = () => void;

export type Store<S, A> = {
  dispatch: (action: A | Promise<A>) => Promise<void>;
  getState: () => S;
  subscribe: (fn: Subscriber) => UnSubscriber;
};

export function createStore<S, A extends Action = AnyAction>(
  initState: S,
  update: Update<S, A>
): Store<S, A> {
  let state = { ...initState };
  const subscribers = new Set<Subscriber>();

  const dispatch = async (action: A | Promise<A>): Promise<void> => {
    if (action instanceof Promise) {
      return action.then(handleUpdate);
    } else {
      return Promise.resolve(handleUpdate(action));
    }
  };

  const handleUpdate = (a: A): void => {
    const r = update(state, a);
    if (r instanceof Promise) {
      r.then((nextState) => {
        changeState(nextState, state);
      });
    } else {
      changeState(r, state);
    }
  };

  const changeState = (nextState: S, prevState: S): void => {
    if (nextState !== prevState) {
      state = { ...prevState, ...nextState };
      subscribers.forEach((fn) => {
        fn();
      });
    }
  };

  const getState = (): S => {
    return state;
  };

  const subscribe = (fn: Subscriber): UnSubscriber => {
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  };

  return {
    dispatch,
    getState,
    subscribe,
  };
}

export function combine<S, A extends Action = AnyAction>(
  updates: StateUpdates<S, A>
): Update<S, A> {
  return (state: S, action: A): S | Promise<S> => {
    let hasChanged = false;
    const nextState = { ...state };
    const promises = [];
    Object.keys(updates).forEach((key) => {
      const update = updates[key];
      const partialState = nextState[key];
      const nextPartialState = update(partialState, action);
      if (nextPartialState instanceof Promise) {
        promises.push(nextPartialState);
        nextPartialState.then((s) => {
          const hasChangedPartial = partialState !== s;
          hasChanged = hasChanged || hasChangedPartial;
          if (hasChangedPartial) {
            nextState[key] = s;
          }
        });
      } else {
        const hasChangedPartial = partialState !== nextPartialState;
        hasChanged = hasChanged || hasChangedPartial;
        if (hasChangedPartial) {
          nextState[key] = nextPartialState;
        }
      }
    });
    if (promises.length > 0) {
      return Promise.all(promises).then(() => {
        if (hasChanged) {
          return nextState;
        }
        return state;
      });
    } else {
      if (hasChanged) {
        return nextState;
      }
      return state;
    }
  };
}
