var exec = require('child_process').exec
  , fs = require('fs')
  , semver = require('semver')
  , patterns = require('./patterns');

var DEFAULT_SEPARATOR = '\n'
  , DEFAULT_ENCODING = 'utf-8';

var exports = module.exports = { name: 'semver-sync' };

module.exports.version = '1.3.0';

var getExtension = function (filename) {
  var parts = filename.split('.');
  return parts.length > 1 ? parts.pop() : '';
};

var count = 0;

module.exports.getVersion = function (filename) {
	var ext = getExtension(filename)
    , result;

  if (!~['js', 'json'].indexOf(ext)) {
    throw new Error('unsupported extension ' + ext);
  }

  var data = fs.readFileSync(filename, DEFAULT_ENCODING);
  if (ext === 'json') {
    data = '(' + data + ')';
  }

  result = patterns.parse(data);

  return result;
};

module.exports.setVersion = function (arr, version) {
  arr.forEach(function (filename) {
    var current = module.exports.getVersion(filename);
    var lines = fs.readFileSync(filename, DEFAULT_ENCODING).split(DEFAULT_SEPARATOR);
    lines[current.line - 1] = lines[current.line - 1].replace(current.version, version);
    fs.writeFileSync(filename, lines.join(DEFAULT_SEPARATOR), DEFAULT_ENCODING);
  });
};

module.exports.commitSourcesAndCreateTag = function (arr, version, callback, options) {
  var addSources = function(callback) {
    var file;
    if (!(file = arr.shift())) return callback();

    exec('git add ' + file, options, function(error, stdout, stderr) {
      if (stderr) console.log(stderr);
      if (error !== null) throw error;
      addSources(callback);
    });
  };

  var commitSources = function(callback) {
    exec('git commit -m "v' + version + '"', options, function(error, stdout, stderr) {
      if (stderr) console.log(stderr);
      if (error !== null) throw error;
      callback();
    });
  };

  var createTag = function(callback) {
    exec('git tag v' + version, options, function(error, stdout, stderr) {
      if (stderr) console.log(stderr);
      if (error !== null) throw error;
      callback();
    });
  };

  addSources(function() {
    commitSources(function() {
      createTag(callback);
    });
  });
};
