import { createSourceFile, isExportAssignment, isExportDeclaration, isImportDeclaration, isStringLiteral, ScriptTarget, NamedImports } from 'typescript';
import { GenerateASTFromFile } from '../../../ast/typescript/typesctipt_ast.service';
import type { FileAnalyzer } from '../file_analyzer';

const EntityAnalyser : FileAnalyzer = {
  name : 'entity',
  pattern : '**/*.entity.ts',
  analyze : async (filepath, contents) => {
    let ast = await GenerateASTFromFile(filepath, String(contents));
    console.log('Tree', String(ast));
    let entityIdentifierName : string;

    // Lookup for identifier being imported from '@architect/entity';
    ast.forEachChild((node) => {
      if(isImportDeclaration(node)) {
        if(isStringLiteral(node.moduleSpecifier)){
          if(node.moduleSpecifier.text === "@architect/entity") {
            entityIdentifierName = (node.importClause!.namedBindings! as NamedImports).elements[0].name.escapedText as string;
          }
        }
      }
    });

    console.log("[EntityAnalyzer]: Entity type name is", entityIdentifierName);

    ast.forEachChild((node) => {
      // Search for everything that is exported

      // # Export Assignment -> Lookup for identifier being exported
      if(isExportAssignment(node)) {
       
      }

      // # Export Declaration -> Lookup for definition being exported
      if(isExportDeclaration(node)) {

      }
    });
    return {
      _category : EntityAnalyser.name,
      extension : 'ts',
      fullpath : filepath,
      relativePath : filepath,
      content : createSourceFile(filepath, String(contents), ScriptTarget.ESNext),
    };
  }
}

export default EntityAnalyser;