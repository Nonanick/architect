import { Entity } from "clerk";
import { promises as fs } from 'fs';
import { Controller, Resolver, Route } from "maestro";
import path from 'path';
import { ProjectEntity } from "../../data/entities";
import ProjectAnalyzerSchemas from "./project_analyzer.schemas";

export class ProjectAnalyzerController extends Controller {

  get baseURL(): string {
    return 'project/analyze';
  }

  @Route({
    url: 'path',
    methods: 'post',
    schema: ProjectAnalyzerSchemas.OpenMetadataJsonFileFromProjectRoot
  })
  public openMetadataFromPath: Resolver = async (req) => {

    let expectMetadataPath = path.join(req.get('path'), '.architect', 'manifest.json');
    let response = fs.readFile(expectMetadataPath, 'utf-8').then(data => {
      try {
        let projectSettings = JSON.parse(data);
        let projectModel = Entity.instance(ProjectEntity).model();
        projectModel.$set(projectSettings);
        return projectModel.$json();
      } catch (err) {
        return new Error("Failed to parse project manifest file! Cannot read project configurations!");
      }
    }).catch(err => {
      return err;
    });

    return response;
  };

}