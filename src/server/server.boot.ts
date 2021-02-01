import { Maestro } from 'maestro';
import { ConfigurationController } from './modules/configuration/configuration.controller';

const ArchitectServer = new Maestro;

ArchitectServer.addController(
  new ConfigurationController
);

export default ArchitectServer;