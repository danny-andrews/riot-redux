function assert(thingToBeTruthy, message) {
  if(!thingToBeTruthy) { throw new Error(message); }
}

export default function(store) {
  assert(store, '"store" cannot be null!');

  function dispatch(action) {
    assert(action && action.type, '"action" must have a "type" property!');
    store.dispatch(action);
  }
  function subscribe(selector, callback = () => this.update()) {
    assert(selector, '"selector" cannot be null!');
    let currentState = selector(store.getState());

    function handleChange() {
      let nextState = selector(store.getState());
      if(nextState !== currentState) {
        currentState = nextState;
        callback(currentState);
      }
    }

    let unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
  }

  return Object.freeze({
    dispatch,
    subscribe
  });
}
