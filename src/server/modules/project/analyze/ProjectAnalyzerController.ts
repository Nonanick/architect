import { Controller } from "maestro";

export class ProjectAnalyzerController extends Controller {
  get baseURL(): string {
    return 'project/analyze';
  }

}