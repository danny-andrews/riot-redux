module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (store, selector, actions) {
	  assert(store, '"store" cannot be null!');

	  function init() {
	    var _this = this;

	    selector = selector || this.opts.selector || defaultSelector;
	    actions = actions || this.opts.actions;
	    if (actions) this.actions = (0, _redux.bindActionCreators)(actions, store.dispatch);
	    var getState = function getState() {
	      return selector(store.getState());
	    };
	    var subscribe = function subscribe() {
	      var nextState = getState();
	      if (nextState !== _this.state) {
	        _this.state = nextState;
	        _this.update();
	      }
	    };
	    var data = getState();
	    var unsubscribe = store.subscribe(subscribe);
	    this.on("unmount", function () {
	      return unsubscribe();
	    });
	    subscribe();
	  }

	  return { init: init };
	};

	var _redux = __webpack_require__(1);

	function assert(thingToBeTruthy, message) {
	  if (!thingToBeTruthy) {
	    throw new Error(message);
	  }
	} // migrate from https://github.com/danny-andrews/riot-redux

	var defaultSelector = function defaultSelector(state) {
	  return state;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("redux");

/***/ }
/******/ ]);