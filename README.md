# Riot Redux

Riot bindings for [Redux](https://github.com/rackt/redux).


## Installation

Riot Redux requires Riot **2.1.0 or later**.  

`npm install --save-dev riot-redux`

## Usage

This mixin will use the following properties set on the component (if they exist):
* `{Object} [actions]` An object whose keys are the names of the functions that will be set on the component instance and whose values are action creators. (Note: these will be automaatically bound to the `dispatch` method provided by the redux store inside of the riot-redux mixin's `init` method.)
* `{Function} [selector]` A function which takes `state` as a parameter and returns an object whose keys are the names of the properties that will be set on the component instance, and whose values are the values of those properties.

Example:

index.js
```javascript
import configureStore from './store/configure-store';
import riotRedux from 'riot-redux';

const store = configureStore({age: 12});
riot.mixin('redux', riotRedux(store))
```

app.tag
```html
<app>
  <tiger actions={actions} selector={selector}>
  <script>
  this.on('mount', function() {
    this.actions = {roar: () => console.log('BWAAA!')};
    this.selector = (state) => ({age: state.age});
  })
  </script>
</app>
```

tiger.tag
```html
<tiger>
  <p>{age}</p> <!-- 12 -->
  <button onclick={roar}></button> <!-- Clicking me prints 'BWAAA!' in the console. -->
  <script>
    this.mixin('redux');
  </script>
</tiger>
```
