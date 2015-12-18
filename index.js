import { bindActionCreators } from 'redux';

function assert(thingToBeTruthy, message) {
  if(!thingToBeTruthy) { throw new Error(message); }
}

export default function(store) {
  assert(store, '"store" cannot be null!');

  function subscribe(selector) {
    let callback = (state) => this.update(state);
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
  function init() {
    let {actions: actions = {}, selector: selector = () => ({})} = this.opts;
    let boundActions = bindActionCreators(actions, store.dispatch);
    let data = selector(store.getState());
    assert(
      data && typeof data === 'object',
      '"selector" must return an object. Please provide a valid selector.\n' +
        `Selector given: ${selector}\n` +
        `Value returned: ${data}`
    );
    Object.keys(boundActions).forEach((actionName) => {
      this[actionName] = function(e) {
        if(e) {
          e.preventUpdate = true;
        }
        boundActions[actionName]();
      };
    });
    Object.keys(data).forEach((key) => this[key] = data[key]);
    subscribe.call(this, selector);
  }

  return {init};
}
