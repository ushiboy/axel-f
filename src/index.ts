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

export type StateUpdates<T, S extends Action = AnyAction> = {
  [K in keyof T]: Update<T[K], S>;
};

export type Store<S, A> = {
  dispatch: (action: A | Promise<A>) => Promise<void>;
  getState: () => S;
};

export function createStore<S, A extends Action = AnyAction>(
  initState: S,
  stateUpdates: StateUpdates<S, A>
): Store<S, A> {
  const state = { ...initState };
  return {
    async dispatch(action: A | Promise<A>): Promise<void> {
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
