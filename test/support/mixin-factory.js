import reduxMixin from '../../index';

export default function(store) {
  let mixin = reduxMixin(store);
  mixin.opts = {};
  mixin.update = () => {};
  mixin.on = () => {};
  return mixin;
}
