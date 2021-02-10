import type { Store } from 'clerk';
import { ProjectEntity } from '../entities/ProjectEntity';

export function InjectServerEntities(store : Store) {
  
  store.add(
    ProjectEntity
  );

  return store;
}