var test = require('tap').test
  , sync = require('../');

console.log(sync);
test('reading version numbers', function (t) {
    t.equal(sync.getVersion('fixtures/package.json'), '0.0.1', "reading version numbers from package.json");
    t.equal(sync.getVersion('fixtures/component.json'), '0.0.1', "reading version numbers from component.json");
    t.equal(sync.getVersion('fixtures/assigned.js'), '0.0.7', "reading version numbers from a js module");
    t.equal(sync.getVersion('fixtures/literal.js'), '0.10.29', "reading version numbers from a js module with object literals");
    t.equal(sync.getVersion('fixtures/assigned-literal.js'), '7.7.7', "reading version numbers from a js module with object literals");
    t.end();
});

test('setting version numbers', function (t) {
    sync.setVersion(['fixtures/package.json'], '0.0.5');
    t.equal(sync.getVersion('fixtures/package.json'), '0.0.5');
    sync.setVersion(['fixtures/package.json'], '0.0.1');
    t.equal(sync.getVersion('fixtures/package.json'), '0.0.1');
    t.end();
});