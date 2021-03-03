import { Maestro } from 'maestro';
import DefaultAdapter from './default.adapter';

const Server = new Maestro();

Server.addAdapter(
  DefaultAdapter
);

export default Server;