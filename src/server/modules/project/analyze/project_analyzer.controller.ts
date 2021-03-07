import { Entity } from "clerk";
import { Controller, Resolver, Route, RouteResponse } from "maestro";
import { SchemaFromEntity } from "maestro-clerk";
import { ProjectEntity } from "../../../data/entities";
import path from 'path';
import { promises as fs } from 'fs';

export class ProjectAnalyzerController extends Controller {

  get baseURL(): string {
    return 'project/analyze';
  }

  @Route({
    url: 'path',
    methods: 'post',
    schema: {
      body: {
        type: 'object',
        required: ['root'],
        properties: {
          root: { type: 'string' }
        },
        additionalProperties: false,
      },
      response: {
        '2xx': SchemaFromEntity(Entity.instance(ProjectEntity)),
        '404': {
          type: 'object',
          properties: { message: { type: 'string' }, }
        },
        '5xx': { type: 'string' }
      }
    }
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

  public;
}