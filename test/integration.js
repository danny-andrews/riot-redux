import expect from 'expect';
import riot from 'riot';
import { compileDummy, setup, teardown } from './support/integration-helpers';
import reduxMixin from '../index';
import FakeStore from './support/fake-store';

const DUMMY_NAME = 'dummy';
let rerenderSpy = expect.createSpy();

compileDummy({
  name: DUMMY_NAME,
  html: `<p class="name">{name}</p>
        <button class="change-name" onclick={changeName}></button>`,
  code() {
    this.mixin('redux');
    this.on('update', rerenderSpy);
  }
});

describe('component with riot-redux mixed in', function() {
  beforeEach(function() {
    this.store = FakeStore({name: 'Preston', petIds: [3, 4], age: 3});
    riot.mixin('redux', reduxMixin(this.store));
    this.actionSpy = expect.createSpy();
    this.subject = setup({
      name: DUMMY_NAME,
      data: {
        selector(state) {
          return {name: state.name, pets: state.petIds};
        },
        actions: {changeName: this.actionSpy}
      }
    });
    this.componentEl = document.querySelector(DUMMY_NAME);
    rerenderSpy.calls = [];
  });
  afterEach(function() {
    this.actionSpy.restore();
    teardown(this.subject);
  });

  it('has instance vars set', function() {
    expect(this.subject.name).toBe('Preston');
    expect(this.subject.pets).toEqual([3, 4]);
  });

  it('has actions set', function() {
    expect(this.subject.changeName).toBeA(Function);
  });

  it('displays properties', function() {
    let nameText = this.componentEl.querySelector('.name').innerHTML;
    expect(nameText).toBe('Preston');
  });

  it('runs actions', function() {
    let button = this.componentEl.querySelector('.change-name');
    button.click();
    expect(this.actionSpy).toHaveBeenCalled();
  });

  it('rerenders when state changes', function() {
    let newState = Object.assign(this.store.getState(), {name: 'Tom'});
    this.store.setState(newState);
    let nameText = this.componentEl.querySelector('.name').innerHTML;
    expect(rerenderSpy).toHaveBeenCalled();
    expect(nameText).toBe('Tom');
  });

  it('does not auto-rerender when events are raised', function() {
    let button = this.componentEl.querySelector('.change-name');
    button.click();
    expect(rerenderSpy.calls.length).toBe(0);
  });
});
