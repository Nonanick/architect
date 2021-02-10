import type { Store } from "clerk";
import * as ServerEntities from "../entities";

export function InjectServerEntities(store: Store) {
  store.add(
    ...(
      Object.entries(ServerEntities).map(([name, entity]) => entity)
    ),
  );

  return store;
}
