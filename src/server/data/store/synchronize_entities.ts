import type { IEntityProcedureResponse, Store } from "clerk";
import type { Maybe } from 'maestro';

export async function InstallServerEntities(
  store: Store,
) {
  let response : Maybe<IEntityProcedureResponse>[] = [];
  for( let entity of store.allEntities()){
    response.push(await entity.execute("create-entity", {}));
  };

  return response;
}
