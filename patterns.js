var uglify = require('uglify-js');

var isObjectLiteral = function (node) {
  return node.start.value === '{' && node.end.value === '}';
}

var traverse = function (node) {
  var result;
  if (node.operator === '=' && node.left.property === 'version' 
      && ~['module', 'exports'].indexOf(node.left.start.value)) {
    // matching module.exports.version and exports.version
    // TODO: also matches module.version which is not quite OK
    return node.right.end.value;
  } else if (node.operator === '=' && node.left.property === 'exports'
    && isObjectLiteral(node.right)) {
    result = extractVersion(node.right.properties);
    if (result) return result;
  } else if (node.start && node.value && node.start.value == 'return'
      && isObjectLiteral(node.value)) {
    result = extractVersion(node.value.properties);
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

var extractVersion = function (properties) {
  var result;
  properties.every(function (prop) {
    if (prop.key === 'version') {
      result = prop.value.value;
      return false;
    }
  });
  return result;
}

var exports = module.exports = {};

exports.parse = function (data) {
    var ast = uglify.parse(data);
    return traverse(ast);
}
