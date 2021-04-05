axel-f
=====

## Draft

Simple case

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
