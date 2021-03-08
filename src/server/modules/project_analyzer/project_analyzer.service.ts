import { Entity } from 'clerk';
import { promises as fs } from 'fs';
import { ProjectEntity } from '../../data/entities';
import { FileAnalyzerOutput, FileAnalyzer } from './analyzer/file_analyzer';

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


async function AnalyzeFilesInProject(pathToProjectSourceRoot: string) {
  let output: FileAnalyzerOutput;

  for (let categorizer of FileAnalyzer) {

  }

  return output;
}

export default {
  LoadProjectMetadata,
  CategoryzeFilesInProject: AnalyzeFilesInProject
}