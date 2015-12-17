(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RiotRedux"] = factory();
	else
		root["RiotRedux"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (store) {
	  assert(store, '"store" cannot be null!');

	  function dispatch(action) {
	    assert(action && action.type, '"action" must have a "type" property!');
	    store.dispatch(action);
	  }
	  function subscribe(selector) {
	    var _this = this;

	    var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {
	      return _this.update();
	    } : arguments[1];

	    assert(selector, '"selector" cannot be null!');
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

	  return Object.freeze({
	    dispatch: dispatch,
	    subscribe: subscribe
	  });
	};

	function assert(thingToBeTruthy, message) {
	  if (!thingToBeTruthy) {
	    throw new Error(message);
	  }
	}

/***/ }
/******/ ])
});
;