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

	exports.default = function (store) {
	  assert(store, '"store" cannot be null!');

	  function subscribe(selector) {
	    var _this = this;

	    var callback = function callback(state) {
	      return _this.update(state);
	    };
	    var currentState = selector(store.getState());

	    function handleChange() {
	      var nextState = selector(store.getState());
	      if (nextState !== currentState) {
	        currentState = nextState;
	        callback(currentState);
	      }
	    }

	    var unsubscribe = store.subscribe(handleChange);
	    handleChange();
	    return unsubscribe;
	  }

	  function init() {
	    var _this2 = this;

	    var _opts = this.opts;
	    var _opts$actions = _opts.actions;
	    var actions = _opts$actions === undefined ? {} : _opts$actions;
	    var _opts$selector = _opts.selector;
	    var selector = _opts$selector === undefined ? function () {
	      return {};
	    } : _opts$selector;

	    var boundActions = (0, _redux.bindActionCreators)(actions, store.dispatch);
	    var data = selector(store.getState());
	    assert(data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object', '"selector" must return an object. Please provide a valid selector.\n' + ('Selector given: ' + selector + '\n') + ('Value returned: ' + data));

	    this.store = store;
	    Object.keys(boundActions).forEach(function (actionName) {
	      _this2[actionName] = function () {
	        if (window.Event && window.Event.prototype.isPrototypeOf(arguments[0])) {
	          arguments[0].preventUpdate = true;
	        }
	        boundActions[actionName].apply(boundActions, arguments);
	      };
	    });
	    Object.keys(data).forEach(function (key) {
	      return _this2[key] = data[key];
	    });

	    subscribe.call(this, selector);
	  }

	  return { init: init };
	};

	var _redux = __webpack_require__(1);

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function assert(thingToBeTruthy, message) {
	  if (!thingToBeTruthy) {
	    throw new Error(message);
	  }
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("redux");

/***/ }
/******/ ]);