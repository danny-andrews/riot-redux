import expect from 'expect';
import reduxMixin from '../index';
import FakeStore from './support/fake-store';

const TEST_ACTION = {type: 'TEST_ACTION'};

describe('riot-redux', function() {
  it('throws Error if store not given', function() {
    expect(() => reduxMixin()).toThrow(/store/);
  });

  describe('#dispatch', function() {
    beforeEach(function() {
      this.store = FakeStore();
      this.spy = expect.spyOn(this.store, 'dispatch');
    });

    afterEach(function() {
      this.spy.restore();
    });

    it('calls dispatch on passed-in store', function() {
      let mixin = reduxMixin(this.store);
      mixin.dispatch(TEST_ACTION);
      expect(this.spy).toHaveBeenCalledWith(TEST_ACTION);
    });

    it('throws an error if action is null', function() {
      let mixin = reduxMixin(this.store);
      expect(() => mixin.dispatch()).toThrow(/action/);
    });

    it('throws an error if action does not have type property', function() {
      let mixin = reduxMixin(this.store);
      expect(() => mixin.dispatch()).toThrow(/type.*property/);
    });
  });

  describe('#subscribe', function() {
    beforeEach(function() {
      this.store = FakeStore({value: 1});
      this.subject = reduxMixin(this.store);
      this.spy = expect.createSpy();
    });
    afterEach(function() {
      this.spy.restore();
    });

    it('throws an error if selector is null', function() {
      expect(() => this.subject.subscribe()).toThrow(/selector/);
    });

    it('calls callback when selector value changes', function() {
      const selector = (store) => store.value;
      this.subject.subscribe(selector, this.spy);
      this.store.setState({value: 2});
      expect(this.spy).toHaveBeenCalled();
    });

    it('does not call callback after you unsubscribe', function() {
      const selector = (store) => store.value;
      let unsubscribe = this.subject.subscribe(selector, this.spy);
      unsubscribe();
      this.store.setState({value: 2});
      expect(this.spy.calls.length).toBe(0);
    });

    it('does not call callback when selector value stays ===', function() {
      const selector = (store) => store.value;
      this.subject.subscribe(selector, this.spy);
      this.store.setState({value: 1});
      expect(this.spy.calls.length).toBe(0);
    });
  });
});
