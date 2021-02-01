import { Store } from 'clerk';
import { ServerEntityFactory } from './ServerEntityFactory';

export const ServerStore = new Store(new ServerEntityFactory);
