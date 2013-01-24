var fs = require('fs')
  , semver = require('semver');

var exports = module.exports = { name: 'test' };

var getExtension = function (filename) {
  var parts = filename.split('.');
  return parts.length > 1 ? parts.pop() : '';
}

module.exports.getVersion = function (file) {
	var ext = getExtension(file);
  if (ext === 'json' || ext === 'js') {
    var obj = require(file);
    if (semver.valid(obj.version)) {
      return obj.version;
    } else {
      throw new Error('Missing or wrong semver number in ' + file);
    }
  } else {
    console.error(file, ext);
    throw new Error('unsupported extension');
  }
};

module.exports.setVersion = function (arr, version) {
  arr.forEach(function (filename) {
    var ext = getExtension(filename);
    if (ext === 'json') {
      // TODO: check here that we only replace the version
      // number in the root and not for other dependencies
    } else {
      // TODO: throw an error if there is more than one occurence 
      // of the version number in the file we're updating
    }
  });
};