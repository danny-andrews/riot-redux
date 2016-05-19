import assert from './lib/util/assert';
import {bindActionCreators} from 'redux';
import observeStore from './lib/util/observe-store';

export default function(store) {
  assert(store, '"store" cannot be null!');

  function init() {
    const {actions: actions = {}, selector: selector = () => ({})} = this.opts;
    const boundActions = bindActionCreators(actions, store.dispatch);
    const data = selector(store.getState());
    assert(
      data && typeof data === 'object',
      '"selector" must return an object. Please provide a valid selector.\n'
        + `Selector given: ${selector}\n`
        + `Value returned: ${data}`
    );

    this.store = store;
    Object.keys(boundActions).forEach(actionName => {
      this[actionName] = function(...args) {
        if(window.Event && window.Event.prototype.isPrototypeOf(args[0])) {
          args[0].preventUpdate = true;
        }

        return boundActions[actionName](...args);
      };
    });
    Object.keys(data).forEach(key => {
      this[key] = data[key];
    });

    const unsubscribe = observeStore(
      store,
      selector,
      state => this.update(state)
    );
    this.on('unmount', unsubscribe);
  }

  return {init};
}
