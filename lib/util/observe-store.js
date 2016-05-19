export default function(store, select, onChange) {
  let currentState = null;

  function handleChange() {
    const nextState = select(store.getState());
    if(nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();

  return unsubscribe;
}
