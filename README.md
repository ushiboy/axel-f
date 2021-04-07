axel-f
=====

axel-f is a state management library.

This is a library like redux, where update (or reducer as it is called in redux) can return a Promise.

## Quick Sample

Here is a simple usecase.

```typescript
const initState = { count: 0 };

const update = (state, action) => {
  switch (action.type) {
    case 'increment': {
      return new Promise((resolve, reject) => {
        resolve({ count: state.count + 1});
      });
    }
    case 'decrement': {
      return new Promise((resolve, reject) => {
        resolve({ count: state.count - 1});
      });
    }
  }
};

const store = createStore(initState, update);

store.subscribe(() => {
  console.log(store.getStore());
});

(async function() {
  await store.dispatch({ type: 'increment' });
  await store.dispatch({ type: 'increment' });
  await store.dispatch({ type: 'decrement' });
}());
```

## API

### method

#### createStore

It receives the initial state and update and creates a store.

#### combine

It takes a dictionary object of updates keyed by a group of states and creates a update.

## License

MIT
