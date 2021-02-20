import { Maestro } from 'maestro';
import { ConfigurationController } from './modules/configuration/configuration.controller';
import { ProjectController } from './modules/project/project.controller';
import { TrackedProjectsController } from './modules/project/tracked/tracked.projects.controller';

const ArchitectServer = new Maestro;

ArchitectServer.addController(
  new ConfigurationController,
  new ProjectController,
  new TrackedProjectsController
);

export default ArchitectServer;