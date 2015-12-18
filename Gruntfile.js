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
      mocha: {
        command: 'mocha --recursive --compilers js:babel-core/register ' +
          '--require ./test/setup.js'
      },
      npmPublish: {command: 'npm publish'}
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
        options: {remote: 'origin', branch: 'master'}
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
      grunt.task.run(
        'test',
        'webpack:all',
        'gitadd',
        'gitcommit:' + version,
        'gittag:' + version,
        'gitpush',
        'shell:npmPublish'
      );
    }
  );
};
