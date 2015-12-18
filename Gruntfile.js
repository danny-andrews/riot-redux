/* jshint varstmt: false */
/* jscs:disable requireTemplateStrings */
var glob = require('glob');
var assert = require('assert');
var semver = require('semver');
var webpack = require('./webpack.config');
const JS_GLOB = './{,test/**/}*.js';
const JS_FILES = glob.sync(JS_GLOB);

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jscs: {src: JS_GLOB},
    shell: {
      jshint: {command: 'node_modules/.bin/jshint ' + JS_FILES.join(' ')},
      mocha: {
        command: 'mocha --recursive --compilers js:babel-core/register ' +
          '--require ./test/setup.js'
      },
      npmPublish: {command: 'npm publish'},
      npmVersion: {
        command: 'npm --no-git-tag-version version ' +
          '<%= grunt.task.current.args[0] %>'
      }
    },
    webpack: {all: webpack},
    gitadd: {
      dist: {
        options: {all: true}
      }
    },
    gitcheckout: {
      dist: {
        options: {branch: 'master'}
      }
    },
    gitcommit: {
      dist: {
        options: {verbose: true, message: '<%= grunt.task.current.args[0] %>'}
      }
    },
    gittag: {
      dist: {
        options: {tag: '<%= grunt.task.current.args[0] %>'}
      }
    },
    gitpush: {
      dist: {
        options: {remote: 'origin', branch: '<%= grunt.task.current.args[0] %>'}
      }
    }
  });

  grunt.registerTask('default', 'test');
  grunt.registerTask('lint', 'Lint code.', ['shell:jshint', 'jscs']);
  grunt.registerTask('test', 'Run tests.', ['lint', 'shell:mocha']);
  grunt.registerTask(
    'publish',
    'Compile and push new version to git repo and npm.',
    function(version) {
      assert(version, 'Version number is required!');
      var versionNum = semver.clean(version);
      assert(
        semver.valid(versionNum),
        'Given version num (' + version + ') is invalid. Must be in the' +
          ' following format: [X.X.X].'
      );
      grunt.task.run(
        'test',
        'webpack:all',
        'shell:npmVersion:' + version,
        'gitadd:dist',
        'gitcommit:dist:' + version,
        'gittag:dist:' + version,
        'gitpush:dist:master',
        'gitpush:dist:' + version,
        'shell:npmPublish'
      );
    }
  );
};
