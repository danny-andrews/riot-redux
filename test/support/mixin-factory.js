import reduxMixin from '../../index';

export default function(store) {
  let mixin = reduxMixin(store);
  mixin.opts = {};
  mixin.update = () => {};
  return mixin;
}
