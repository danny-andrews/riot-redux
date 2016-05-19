/* eslint-disable prefer-rest-params, prefer-arrow-callback, prefer-template */
const path = require('path');
const parseArgs = require('minimist');

const x = module.exports;
const args = parseArgs(process.argv.slice(2), {'--': true});
const version = args['--'][0];
const PATHS = {
  moduleBins: path.join('node_modules', '.bin'),
  jsSrc: ['"*.js"', 'test', 'lib']
};

function binPath(bin) {
  return path.join(PATHS.moduleBins, bin);
}

x.lint = function() {
  return [
    this.shell('eslint ' + PATHS.jsSrc.join(' ')),
    this.shell(binPath('sort-package-json'))
  ];
};

x.test = function() {
  return this.shell(binPath('mocha'));
};

x.ci = function() {
  return [
    this.start('lint'),
    this.start('test')
  ];
};

x.build = function() {
  return this.shell('webpack');
};

x.publish = function * () {
  this.on('task_error', function() {
    throw new Error('Error in task chain');
  });

  yield this.start(['ci', 'build']);
  yield this.shell('npm --no-git-tag-version version ' + version);
  yield this.shell('git commit -a -m ' + version);
  yield this.shell('git tag ' + version);
  yield [
    this.shell('git push origin master'),
    this.shell('git push origin --tags'),
    this.shell('npm publish')
  ];
};

x.default = x.ci;
