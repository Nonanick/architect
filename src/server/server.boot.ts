import { Maestro } from 'maestro';
import { ConfigurationController } from './modules/configuration/configuration.controller';
import { ProjectController } from './modules/project/project.controller';
import { ProjectAnalyzerController } from './modules/project_analyzer/project_analyzer.controller';
import { TrackedProjectsController } from './modules/tracked_projects/tracked_projects.controller';

const ArchitectServer = new Maestro;

ArchitectServer.addController(
  new ConfigurationController,
  new ProjectController,
  new ProjectAnalyzerController,
  new TrackedProjectsController
);

export default ArchitectServer;