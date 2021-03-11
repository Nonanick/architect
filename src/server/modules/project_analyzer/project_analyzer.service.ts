import { Entity } from 'clerk';
import { promises as fs } from 'fs';
import { ProjectEntity } from '../../data/entities';
import type { FileAnalyzerOutput, FileAnalysisWithCategory } from './analyzer/file_analyzer';
import { FileAnalyzer } from './analyzer/file_analyzer';
import glob from 'fast-glob';
import path from 'path';

async function LoadProjectMetadata(pathToJSON: string) {
  let response = fs
    .readFile(pathToJSON, 'utf-8')
    .then(data => {
      try {
        let projectSettings = JSON.parse(data);
        let projectModel = Entity.instance(ProjectEntity).model();
        projectModel.$set(projectSettings);
        return projectModel.$json();
      } catch (err) {
        return new Error("Failed to parse project manifest file! Cannot read project configurations!");
      }
    })
    .catch(err => {
      return err;
    });

  return response;
}


async function AnalyzeFilesInProject(pathToProjectSourceRoot: string, categories?: string[]) {
  let output: FileAnalyzerOutput = {};

  let resolveCategorizer: any[] = [];
  let resolveOutput: Promise<FileAnalysisWithCategory>[] = [];

  let analyzers = await FileAnalyzer;
  console.log("Using as analyzers: ", analyzers);

  for (let categorizer of analyzers) {
    // If categories were specified chek if this categorizer is listed as required
    if (categories != null) {
      if (!categories.includes(categorizer.name)) {
        continue;
      }
    }

    resolveCategorizer.push(
      glob(categorizer.pattern, { cwd: pathToProjectSourceRoot })
        .then(async candidates => {
          console.log("Found file candidates for", categorizer.name, candidates);
          for (let candidate of candidates) {
            let fileContent = await fs.readFile(path.join(pathToProjectSourceRoot, candidate));
            resolveOutput.push(
              categorizer.analyze(candidate, fileContent) as Promise<FileAnalysisWithCategory>
            );
          }
          return candidates;
        })
    );
  }

  return Promise
    .all(resolveCategorizer)
    .then(_ => Promise.all(resolveOutput))
    .then(outputs => {
      for (let out of outputs) {
        if (output[out._category] == null) {
          output[out._category] = [];
        }
        output[out._category].push(out);
      }
      return output;
    });

}

export default {
  LoadProjectMetadata,
  CategoryzeFilesInProject: AnalyzeFilesInProject
}