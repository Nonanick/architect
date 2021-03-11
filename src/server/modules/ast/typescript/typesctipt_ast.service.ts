import { promises as fs } from 'fs';
import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';

export async function GenerateASTFromFile(filepath : string, fileContents? : string) : Promise<SourceFile> {

  if(fileContents == null) {
    fileContents = await fs.readFile(filepath, { encoding : 'utf-8'});
  }

  return createSourceFile(filepath, fileContents, ScriptTarget.ESNext);

}