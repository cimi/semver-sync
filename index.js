var fs = require('fs')
  , semver = require('semver')
  , uglify = require('uglify-js');

var exports = module.exports = { name: 'test' };

module.exports.version = '0.0.1';


var getExtension = function (filename) {
  var parts = filename.split('.');
  return parts.length > 1 ? parts.pop() : '';
};

var count = 0;
var traverse = function (node) {
  // console.log(node);
  // console.log("===========================")
  var result;
  if (node.operator === '=' && node.left.property === 'version' 
      && ~['module', 'exports'].indexOf(node.left.start.value)) {
    // matching module.exports.version and exports.version
    // TODO: also matches module.version which is not quite OK
    return node.right.end.value;
  } else if (node.start && node.value && node.start.value == 'return' 
      && node.value.start.value === '{' && node.value.end.value === '}') {
     // console.log('aici');
     node.value.properties.every(function (prop) {
      if (prop.key === 'version') {
        result = prop.value.value;
        return false;
      }
    });
    if (result) return result;
  } else if (node.length || (node.body && node.body.length)) {
    // using every because we need
    // to break out of the loop
    if (node.body && node.body.length) {
      node = node.body;
    }
    node.every(function (n) {
      result = traverse(n);
      return result ? false : true;
    });
    return result;
  } else if (node.body) {
    return traverse(node.body);
  } else if (node.expression) {
    return traverse(node.expression);
  }
}

module.exports.getVersion = function (filename) {
	var ext = getExtension(filename)
    , version;  
  
  if (!~['js', 'json'].indexOf(ext)) {
    throw new Error('unsupported extension ' + ext);
  }

  var data = fs.readFileSync(filename, 'utf-8');
  if (ext === 'json') {
    version = JSON.parse(data).version;
  } else if (ext === 'js') {
    var ast = uglify.parse(data);
    // console.error(JSON.stringify(ast));
    version = traverse(ast);
  }

  if (!semver.valid(version)) {
    throw new Error('Missing or wrong semver number in ' + filename + '. Found: ' + version);
  }
  return version;
};

module.exports.setVersion = function (arr, version) {
  arr.forEach(function (filename) {
    var ext = getExtension(filename);
    if (ext === 'json') {
      fs.readFile(filename, function (err, data) {
      });
      // TODO: check here that we only replace the version
      // number in the root and not for other dependencies
    } else {
      // TODO: throw an error if there is more than one occurence 
      // of the version number in the file we're updating
    }
  });
};

