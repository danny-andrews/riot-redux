import expect from 'expect';
import Mixin from './support/mixin-factory';
import FakeStore from './support/fake-store';

const TEST_ACTION_CREATOR = payload => ({type: 'TEST_ACTION', payload});

const INVALID_SELECTOR_REGEX = /selector.*must return an object/;

describe('riot-redux', function() {
  it('throws Error if store not given', function() {
    expect(() => Mixin()).toThrow(/store/);
  });

  describe('#init', function() {
    it('exposes store as property of tag instance', function() {
      const store = FakeStore();
      const mixin = Mixin(store);
      mixin.init();
      expect(mixin.store).toEqual(store);
    });

    it('sets actions to be bound actions on tag instance', function() {
      let store = FakeStore();
      let spy = expect.spyOn(store, 'dispatch');
      let mixin = Mixin(store);
      mixin.opts.actions = {
        doSomething: TEST_ACTION_CREATOR,
        doSomethingElse: TEST_ACTION_CREATOR
      };
      mixin.init();
      expect(mixin.doSomething).toExist();
      expect(mixin.doSomethingElse).toExist();
      mixin.doSomething();
      mixin.doSomethingElse(1);
      expect(spy.calls.length).toEqual(2);
      expect(spy.calls[1].arguments[0].payload).toBe(1);
    });

    it('sets instance variables for each key in object returned by selector',
        function() {
      let store = FakeStore({itemIds: [1, 2, 3], name: 'Bob', age: 20});
      let mixin = Mixin(store);
      mixin.opts.selector = function(state) {
        let {itemIds, age} = state;
        return {itemIds, age};
      };
      mixin.init();
      expect(mixin.itemIds).toEqual([1, 2, 3]);
      expect(mixin.age).toBe(20);
      expect(mixin.name).toNotExist();
    });

    context('subscribes the component to store events', function() {
      beforeEach(function() {
        this.store = FakeStore({value: 1});
        this.subject = Mixin(this.store);
        this.spy = expect.spyOn(this.subject, 'update');
      });
      afterEach(function() {
        this.spy.restore();
      });

      it('calls update when selector value changes', function() {
        this.subject.opts.selector = (store) => ({value: store.value});
        this.subject.init();
        this.store.setState({value: 2});
        expect(this.spy).toHaveBeenCalled();
      });

      it('throws error when selector does not return an object', function() {
        this.subject.opts.selector = (store) => store.value;
        expect(() => this.subject.init()).toThrow(INVALID_SELECTOR_REGEX);
      });

      it('throws error when selector returns null', function() {
        this.subject.opts.selector = () => undefined;
        expect(() => this.subject.init()).toThrow(INVALID_SELECTOR_REGEX);
      });

      it('throws error when selector returns undefined', function() {
        this.subject.opts.selector = () => undefined;
        expect(() => this.subject.init()).toThrow(INVALID_SELECTOR_REGEX);
      });
    });
  });
});
