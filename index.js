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

    this.store = store;
    Object.keys(boundActions).forEach((actionName) => {
      this[actionName] = function(...args) {
        if(window.Event && window.Event.prototype.isPrototypeOf(args[0])) {
          args[0].preventUpdate = true;
        }
        return boundActions[actionName](...args);
      };
    });
    Object.keys(data).forEach((key) => this[key] = data[key]);

    const unsubscribe = subscribe.call(this, selector);
    this.on('unmount', unsubscribe);
  }

  return {init};
}
