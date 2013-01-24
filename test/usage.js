var test = require('tap').test
  , sync = require('../');

console.log(sync);
test('usageFail', function (t) {
    t.equal(sync.getVersion('./test/fixtures/package.json'), '0.0.1', "reading version numbers from package.json");
    t.equal(sync.getVersion('./test/fixtures/component.json'), '0.0.1', "reading version numbers from component.json");
    t.equal(sync.getVersion('./test/fixtures/fixture.js'), '0.0.2', "reading version numbers from a js module");
    t.end();
});