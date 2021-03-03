import { Store } from 'clerk';
import DefaultFactory from './factories/default.factory';

const DataStore = new Store(new DefaultFactory);

export { DataStore as Store };