import { Store } from "clerk";
import { ServerEntityFactory } from "./ServerEntityFactory";

const ServerStore = new Store(new ServerEntityFactory());

export { ServerStore };
