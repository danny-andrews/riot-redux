// migrate from https://github.com/danny-andrews/riot-redux

import { bindActionCreators } from 'redux';

function assert(thingToBeTruthy, message) {
  if(!thingToBeTruthy) { throw new Error(message); }
}
let defaultSelector = (state)=> state
export default function(store, selector, actions) {
  assert(store, '"store" cannot be null!');

  function init() {
    selector = selector || this.opts.selector || defaultSelector;
    actions = actions || this.opts.actions;
    if(actions)this.actions = bindActionCreators(actions, store.dispatch);
    let getState = ()=> selector(store.getState())
    let subscribe = ()=>{
      let nextState = getState();
      if(nextState !== this.state) {
        this.state = nextState;
        this.update();
      }
    }
    let data = getState()
    let unsubscribe = store.subscribe(subscribe);
    this.on("unmount", ()=> unsubscribe())
    subscribe();
  }

  return {init};
}
