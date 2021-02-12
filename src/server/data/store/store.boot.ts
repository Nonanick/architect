import type { Store } from 'clerk';
import { InjectServerEntities } from './inject_server_entities';
import { ServerStore } from './server.store';

export async function BootServerStore() : Promise<Store> {

  const store = ServerStore;

  InjectServerEntities(store);

  if(process.env.ENVIRONMENT === "development") {
    console.log("[Store-Boot]: In development mode, checking entities synchronization!");
    try { 
      await SynchronizeStoreSchema(store);
    } catch(err) {
      console.error("Failed to synchronize store!", err);
    }
  }

  return store;
}

export async function SynchronizeStoreSchema(store : Store) {

  for(let entity of store.allEntities()){
    await entity.execute("synchronize", {});
  };

  return true;
}