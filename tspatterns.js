var ts = require("typescript");

function getLine(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
    .line + 1; // + 1 because it is 0-based by default.
}



var exports = module.exports = {};

exports.parse = function (filename, data) {
  var sourceFile = ts.createSourceFile(filename, data);
  var statements = sourceFile.statements;
  for (var statementsIx = 0; statementsIx < statements.length; ++statementsIx) {
    var statement = statements[statementsIx];
    if (statement.kind !== ts.SyntaxKind.VariableStatement ||
        statement.declarationList.kind !==
        ts.SyntaxKind.VariableDeclarationList) {
      continue;
    }

    var decls = statement.declarationList.declarations;
    for (var declsIx = 0; declsIx < decls.length; ++declsIx)  {
      var node = decls[declsIx];
      if (node.kind !== ts.SyntaxKind.VariableDeclaration ||
          node.name.text !== "version") {
        continue;
      }

      var initializer = node.initializer;
      if (initializer.kind !== ts.SyntaxKind.StringLiteral) {
        continue;
      }

      // Bingo!
      return {
        version: initializer.text,
        line: getLine(sourceFile, initializer),
      };
    }
  }
}
