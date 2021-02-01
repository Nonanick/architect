import ElectronStore from 'electron-store';

const StorageCache: {
  [name: string]: ElectronStore;
} = {};

export function storage(name: string): ElectronStore {

  if (StorageCache[name] == null) {
    StorageCache[name] = new ElectronStore({
      name: name
    });
  }

  return StorageCache[name];
}