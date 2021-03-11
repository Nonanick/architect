import { Controller, Resolver, Route } from "maestro";
import path from 'path';
import AnalyzerSchemas from "./project_analyzer.schemas";
import AnalyzerService from './project_analyzer.service';

export class ProjectAnalyzerController extends Controller {

  get baseURL(): string {
    return 'project/analyze';
  }

  @Route({
    url: 'path',
    methods: 'post',
    schema: AnalyzerSchemas.OpenMetadataJsonFileFromProjectRoot
  })
  public openMetadataFromPath: Resolver = async (req) => {

    let expectedMetadataPath = path.join(
      req.get('path'),
      '.architect',
      'manifest.json'
    );

    return AnalyzerService.LoadProjectMetadata(expectedMetadataPath);

  };

  @Route({
    url : 'files',
    methods : 'post',
    schema: AnalyzerSchemas.AnalyzeFilesFromProjectSource
  })
  public analyzeFilesFromProjectSource : Resolver = async (req) => {
    return AnalyzerService.CategoryzeFilesInProject(req.get("src"), req.get("categories"));
  }

}