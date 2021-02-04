import { Maestro } from 'maestro';
import { ConfigurationController } from './modules/configuration/configuration.controller';
import { ProjectController } from './modules/project/ProjectController';

const ArchitectServer = new Maestro;

ArchitectServer.addController(
  new ConfigurationController,
  new ProjectController
);

export default ArchitectServer;