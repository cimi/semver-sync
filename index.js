var fs = require('fs')
  , semver = require('semver')
  , patterns = require('./patterns');

var DEFAULT_SEPARATOR = '\n'
  , DEFAULT_ENCODING = 'utf-8';

var exports = module.exports = { name: 'test' };

module.exports.version = '1.0.1';

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

  if (!semver.valid(result.version)) {
    throw new Error('Missing or wrong semver number in ' + filename + '. Found: ' + version);
  }
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