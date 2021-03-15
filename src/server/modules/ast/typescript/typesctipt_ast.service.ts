import { promises as fs } from 'fs';
import { SyntaxKind, createSourceFile, isIdentifier, isPropertyAssignment, ObjectLiteralExpression, ScriptTarget, SourceFile, Identifier, StringLiteral, ArrowFunction, FunctionDeclaration } from 'typescript';

export async function GenerateASTFromFile(filepath: string, fileContents?: string): Promise<SourceFile> {

  if (fileContents == null) {
    fileContents = await fs.readFile(filepath, { encoding: 'utf-8' });
  }

  return createSourceFile(filepath, fileContents, ScriptTarget.ESNext);

}

export function ParseObjectExpression(expression: ObjectLiteralExpression): any {
  console.log("Must parse expression: ", expression);
  let parsedExpression: any = {};

  for (let prop of expression.properties) {
    if (isPropertyAssignment(prop)) {
      let key: string;
      let value: any;
      if (isIdentifier(prop.name)) {
        key = prop.name.escapedText as string;
      }

      switch (prop.initializer.kind) {
        case SyntaxKind.StringLiteral:
          value = (prop.initializer as StringLiteral).text;
          break;
        case SyntaxKind.ObjectLiteralExpression:
          value = ParseObjectExpression(prop.initializer as ObjectLiteralExpression)
          break;
        case SyntaxKind.Identifier:
          value = CheckForGlobalIdentifiers(prop.initializer as Identifier);
          break;
        case SyntaxKind.FalseKeyword:
          value = false;
          break;
        case SyntaxKind.TrueKeyword:
          value = true;
          break;
        case SyntaxKind.ArrowFunction:
          value = "@function:\n" + (prop.initializer as ArrowFunction);
          break;
        default:
          console.log('Kind', prop.initializer.kind)
          value = prop.initializer.getFullText();
      }
      parsedExpression[key] = value;
    }
  }

  return parsedExpression;
  
}
export function ParseFunction(func : ArrowFunction | FunctionDeclaration) {

}

export function ParseFunctionToStringDeclaration(func : ArrowFunction | FunctionDeclaration) {

}

export function TypeOfObjectExpression(expression: ObjectLiteralExpression): any {

}

export function CheckForGlobalIdentifiers(identifier: Identifier) {
  switch (identifier.escapedText) {
    case 'String':
      return '@global.String';
    case 'Number':
      return '@global.Number';
    case 'Boolean':
      return '@global.Boolean';
    case 'Date':
      return '@global.Date';
    case 'Array':
      return '@global.Array';
  }
}