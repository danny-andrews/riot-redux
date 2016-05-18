import {compileDummy, setup, teardown} from './support/integration-helpers';
import expect from 'expect';
import FakeStore from './support/fake-store';
import reduxMixin from '../index';
import riot from 'riot';

const DUMMY_NAME = 'dummy';
const rerenderSpy = expect.createSpy();

compileDummy({
  name: DUMMY_NAME,
  html: `<p class="name">{name}</p>
        <button class="change-name" onclick={changeName}></button>`,
  code() {
    this.mixin('redux');
    this.on('update', rerenderSpy);
  }
});

function SubjectFac(opts = {}) {
  const {
    store: store = FakeStore(),
    componentData: componentData = {}
  } = opts;
  riot.mixin('redux', reduxMixin(store));

  return {
    tag: setup({name: DUMMY_NAME, data: componentData}),
    el: document.querySelector(DUMMY_NAME)
  };
}

describe('component with riot-redux mixed in', function() {
  beforeEach(function() {
    rerenderSpy.calls = [];
  });
  afterEach(function() {
    teardown();
  });

  it('has instance vars set', function() {
    const store = FakeStore({name: 'Preston', petIds: [3, 4], age: 3});
    const subject = SubjectFac({
      store,
      componentData: {
        selector: state => ({name: state.name, pets: state.petIds})
      }
    }).tag;
    expect(subject.name).toBe('Preston');
    expect(subject.pets).toEqual([3, 4]);
  });

  it('has actions set', function() {
    const subject = SubjectFac({
      componentData: {
        actions: {changeName: () => {}}
      }
    }).tag;
    expect(subject.changeName).toBeA(Function);
  });

  it('displays properties', function() {
    const store = FakeStore({name: 'Preston'});
    const el = SubjectFac({
      store,
      componentData: {
        selector: state => ({name: state.name})
      }
    }).el;

    expect(el.querySelector('.name').innerHTML).toBe('Preston');
  });

  it('runs actions', function() {
    const actionSpy = expect.createSpy();
    const el = SubjectFac({
      componentData: {
        actions: {changeName: actionSpy}
      }
    }).el;
    const button = el.querySelector('.change-name');
    button.click();
    expect(actionSpy).toHaveBeenCalled();
  });

  it('rerenders when state changes', function() {
    const store = FakeStore({name: 'Preston'});
    const el = SubjectFac({
      store,
      componentData: {
        selector: state => ({name: state.name})
      }
    }).el;
    const newState = Object.assign(store.getState(), {name: 'Tom'});
    store.setState(newState);
    const nameText = el.querySelector('.name').innerHTML;
    expect(rerenderSpy).toHaveBeenCalled();
    expect(nameText).toBe('Tom');
  });

  it('does not auto-rerender when events are raised', function() {
    const el = SubjectFac().el;
    const button = el.querySelector('.change-name');
    button.click();
    expect(rerenderSpy.calls.length).toBe(1);
  });

  it('unsubscribes from store events when tag is unmounted', function() {
    const store = FakeStore();
    const storeUnsubscribeSpy = expect.createSpy();
    expect.spyOn(store, 'subscribe').andReturn(storeUnsubscribeSpy);
    const subject = SubjectFac({store}).tag;
    subject.unmount();
    expect(storeUnsubscribeSpy).toHaveBeenCalled();
  });
});
