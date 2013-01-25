var uglify = require('uglify-js');

var isObjectLiteral = function (node) {
  return node.start.value === '{' && node.end.value === '}';
};

var extractVersionProperty = function (properties) {
  var result;
  properties.every(function (prop) {
    if (prop.key === 'version') {
      result = prop.value.value;
      return false;
    }
  });
  return result;
};

var patterns = [];

patterns.push(function (node) {
  // matching module.exports.version = '...' and exports.version = '...'
  // TODO: also matches module.version which is not quite OK
  if (node.operator === '=' && node.left.property === 'version' 
    && ~['module', 'exports'].indexOf(node.left.start.value)) {
  return node.right.end.value;
  }
});

patterns.push(function (node) {
  // matching object literals from assignments to exports
  var result;
  if (node.operator === '=' && node.left.property === 'exports'
    && isObjectLiteral(node.right)) {
    return extractVersionProperty(node.right.properties);
  };
});

patterns.push(function (node) {
  // matching return { [...], version: '...', [...] }
  if (node.start && node.value && node.start.value == 'return'
      && isObjectLiteral(node.value)) {
    return extractVersionProperty(node.value.properties);
  }
});

patterns.push(function (node) {
  // matching generic assignments to .version or 
  // literals containing the property 'version'
  var result;
  if (node.left && node.left.property === 'version') {
    result = node.right.end.value;
  } else if (node.value && isObjectLiteral(node.value)) {
    result = extractVersionProperty(node.value.properties);
  }
  if (result) {
    console.log('WARNING: found version number ' + result + 
      ', but not directly assigned to module or exports.');
  }
  return result;
});

patterns.match = function (node) {
  var result;
  // using every because we need
  // to break out of the loop
  patterns.every(function (pattern) {
    result = pattern(node);
    return result ? false : true;
  });
  return result;
}


var traverse = function (node) {
  var result = patterns.match(node);
  if (result) {
    // if a pattern matched, we return what we found and exit
    return result;
  } else {
    // otherwise, we go deeper in the tree
    if (node.length || (node.body && node.body.length)) {
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
    } else if (node.right && node.right.expression) {
      return traverse(node.right.expression);
    }
  }
}


var exports = module.exports = {};

exports.parse = function (data) {
    var ast = uglify.parse(data);
    console.log(JSON.stringify(ast, null, 2));
    return traverse(ast);
}
