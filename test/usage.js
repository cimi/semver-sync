var test = require('tap').test
  , sync = require('../');


var getVersion = function (filename) {
    return sync.getVersion(filename).version;
}

var getLine = function (filename) {
    return sync.getVersion(filename).line;
}

test('reading version numbers from simple text fixtures', function (t) {
    t.equal(getVersion('fixtures/package.json'), '0.0.1', "json");
    t.equal(getVersion('fixtures/assigned.js'), '0.0.7', "module.exports.version assignment");
    t.equal(getVersion('fixtures/literal.js'), '0.10.29', "object literal returned from a module function");
    t.equal(getVersion('fixtures/assigned-literal.js'), '7.7.7', "object literal assigned to exports");
    t.end();
});

test('reading version numbers from actual libraries', function (t) {
    t.equal(getVersion('fixtures/complete/topojson.js'), '0.0.10', "correctly parsing topojson.js");
    t.equal(getVersion('fixtures/complete/queue.js'), '1.0.0', "correctly parsing queue.js");
    t.equal(getVersion('fixtures/complete/d3.js'), '3.0.5', "correctly parsing d3.js");
    t.end();
});

test('version numbers come with line number infomation', function (t) {
    t.equal(getLine('fixtures/complete/topojson.js'), 248, "line number determined correctly");
    t.end();
});

test('setting version numbers', function (t) {
    sync.setVersion(['fixtures/package.json'], '0.0.5');
    t.equal(sync.getVersion('fixtures/package.json'), '0.0.5');
    sync.setVersion(['fixtures/package.json'], '0.0.1');
    t.equal(sync.getVersion('fixtures/package.json'), '0.0.1');
    t.end();
});