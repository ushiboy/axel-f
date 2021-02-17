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
) => S;

export type StateUpdates<T, S> = {
  [K in keyof T]: Update<T[K], S>;
};

export type Store<A, S> = {
  dispatch: (action: A) => void;
  getState: () => S;
};

export function createStore<A, S>(
  initState: S,
  stateUpdates: StateUpdates<S, A>
): Store<A, S> {
  const state = { ...initState };
  return {
    dispatch(action: A): void {
      Object.keys(stateUpdates).forEach((k) => {
        const s = state[k];
        stateUpdates[k](s, action);
      });
    },
    getState() {
      return state;
    },
  };
}
