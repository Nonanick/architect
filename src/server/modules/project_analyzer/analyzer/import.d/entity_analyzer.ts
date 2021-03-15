import { isExportAssignment, isExportDeclaration, isExportSpecifier, isIdentifier, isImportDeclaration, isNamedExports, isObjectLiteralExpression, isStringLiteral, isVariableDeclaration, isVariableStatement, NamedImports } from 'typescript';
import { GenerateASTFromFile, ParseObjectExpression } from '../../../ast/typescript/typesctipt_ast.service';
import type { FileAnalyzer } from '../file_analyzer';

const EntityAnalyser: FileAnalyzer = {
  name: 'entity',
  pattern: '**/*.entity.ts',
  analyze: async (filepath, contents) => {
    let ast = await GenerateASTFromFile(filepath, String(contents));
    console.log('Tree', String(ast));
    let entityIdentifierName: string;
    let content: Partial<EntityAnalysisOutput> = {};

    // Lookup for identifier being imported from '@architect/entity';
    ast.forEachChild((node) => {
      if (isImportDeclaration(node)) {
        if (isStringLiteral(node.moduleSpecifier)) {
          if (node.moduleSpecifier.text === "@architect/entity") {
            entityIdentifierName = (node.importClause!.namedBindings! as NamedImports).elements[0].name.escapedText as string;
          }
        }
      }
    });

    content.interface_tracked = entityIdentifierName;

    console.log("[EntityAnalyzer]: Entity type name is", entityIdentifierName);

    let lookupForVariableIdentifiers: string[] = [];
    let resolvedExportDefinitions: any[] = [];

    ast.forEachChild((node) => {
      // Search for everything that is exported

      // # Export Assignment -> Lookup for identifier being exported
      if (isExportAssignment(node)) {
        // Exporting expression - Add to lookup
        if (isIdentifier(node.expression)) {
          lookupForVariableIdentifiers.push(node.expression.escapedText as string);
        }
        // Exporting expression - Transform it
        if (isObjectLiteralExpression(node.expression)) {
          resolvedExportDefinitions.push(ParseObjectExpression(node.expression));
        }
      }

      // # Export Declaration -> Lookup for definition being exported
      if (isExportDeclaration(node)) {
        if (isNamedExports(node.exportClause)) {
          for (let el of node.exportClause.elements) {
            if (isExportSpecifier(el)) {
              lookupForVariableIdentifiers.push(el.name.escapedText as string);
            }
          }
        }
      }
    });

    if (lookupForVariableIdentifiers.length > 0) {
      ast.forEachChild((node) => {

        // # Search for variables which 'identifier' has been exported
        if (isVariableStatement(node)) {
          for (let declaration of node.declarationList.declarations) {
            if (isIdentifier(declaration.name)) {
              if (lookupForVariableIdentifiers.includes(declaration.name.escapedText as string)) {
                if(isObjectLiteralExpression(declaration.initializer)) {
                  resolvedExportDefinitions.push(
                    ParseObjectExpression(declaration.initializer)
                  );
                }
              }
            }
          }
        }
      });
    }

    content.definition = resolvedExportDefinitions;
    
    return {
      _category: EntityAnalyser.name,
      extension: 'ts',
      fullpath: filepath,
      relativePath: filepath,
      content,
    };
  }
}

export interface EntityAnalysisOutput {
  interface_tracked: string;
  entity_export_type: 'named' | 'default';
  definition: any;
}
export default EntityAnalyser;