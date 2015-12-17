/* jshint varstmt: false */
/* jscs:disable requireTemplateStrings */
var glob = require('glob');
var webpack = require('./webpack.config');
const JS_GLOB = './{,test/**/}*.js';
const JS_FILES = glob.sync(JS_GLOB);

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jscs: {src: JS_GLOB},
    shell: {
      jshint: {command: 'node_modules/.bin/jshint ' + JS_FILES.join(' ')},
      mocha: {command: 'mocha test/test.js --compilers js:babel-core/register'}
    },
    webpack: {all: webpack}
  });

  grunt.registerTask('lint', 'Lint code.', ['shell:jshint', 'jscs']);
  grunt.registerTask('test', 'Run tests.', ['lint', 'shell:mocha']);
  grunt.registerTask('dist', 'Distribute code.', 'webpack:all');
};
