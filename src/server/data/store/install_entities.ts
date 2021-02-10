import type { Store } from "clerk";

export async function InstallServerEntities(
  store: Store,
) {
  let allCreateEntityPromises = store.allEntities().map(async (entity) => {
    await entity.execute("create-entity", {});
  });

  return Promise.all(allCreateEntityPromises);
}
