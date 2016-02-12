export default function(initialState = {}) {
  let callbacks = [];
  let state = initialState;

  function dispatch(action) {
    return action;
  }
  function setState(newState) {
    state = newState;
    callbacks.forEach((callback) => callback());
  }
  function subscribe(callback) {
    const index = callbacks.length;
    callbacks.push(callback);
    return () => callbacks.splice(index);
  }
  function getState() { return state; }

  return {
    dispatch,
    subscribe,
    getState,
    setState
  };
}
