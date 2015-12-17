import expect from 'expect';
import Mixin from './support/mixin-factory';
import FakeStore from './support/fake-store';

const TEST_ACTION = {type: 'TEST_ACTION'};

describe('riot-redux', function() {
  it('throws Error if store not given', function() {
    expect(() => Mixin()).toThrow(/store/);
  });

  describe('#init', function() {
    it('sets actions to be bound actions on instance', function() {
      let store = FakeStore();
      let spy = expect.spyOn(store, 'dispatch');
      let mixin = Mixin(store);
      mixin.opts.actions = {
        doSomething: () => TEST_ACTION,
        doSomethingElse: () => TEST_ACTION
      };
      mixin.init();
      expect(mixin.doSomething).toExist();
      expect(mixin.doSomethingElse).toExist();
      mixin.doSomething();
      mixin.doSomethingElse();
      expect(spy.calls.length).toEqual(2);
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
        this.subject.opts.selector = (store) => store.value;
        this.subject.init();
        this.store.setState({value: 2});
        expect(this.spy).toHaveBeenCalled();
      });

      it('does not call update when oldValue === newValue', function() {
        this.subject.opts.selector = (store) => store.value;
        this.subject.init();
        expect(this.spy.calls.length).toBe(0);
        this.store.setState({value: 1});
      });
    });
  });
});
