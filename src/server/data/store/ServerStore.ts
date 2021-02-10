import { Store } from "clerk";
import { InjectServerEntities } from "./inject_server_entities";
import { ServerEntityFactory } from "./ServerEntityFactory";

const ServerStore = new Store(new ServerEntityFactory());
InjectServerEntities(ServerStore);

export { ServerStore };
