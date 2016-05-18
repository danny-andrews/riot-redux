/* eslint-disable prefer-template, prefer-arrow-callback */
const assert = require('assert');
const semver = require('semver');
const webpack = require('./webpack.config');

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    shell: {
      mocha: {
        command: 'node_modules/.bin/mocha --recursive '
          + '--compilers js:babel-core/register '
          + '--require ./test/setup.js'
      },
      npmPublish: {command: 'npm publish'},
      npmVersion: {
        command: 'npm --no-git-tag-version version '
          + '<%= grunt.task.current.args[0] %>'
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
  grunt.registerTask('test', 'Run tests.', 'shell:mocha');
  grunt.registerTask(
    'publish',
    'Compile and push new version to git repo and npm.',
    function(version) {
      assert(version, 'Version number is required!');
      const versionNum = semver.clean(version);
      assert(
        semver.valid(versionNum),
        'Given version num (' + version + ') is invalid. Must be in the'
          + ' following format: [X.X.X].'
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
