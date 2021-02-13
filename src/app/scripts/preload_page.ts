import { ArchitectServices as Services, InjectServices } from "../services/inject_services";

InjectServices(window);

type ArchitectServicesType = typeof Services;

var architect = Services;
declare global {

  interface Window {
    architect: typeof Services;
  }
  
  interface globalThis {
    architect: typeof Services;
  }

  var architect : ArchitectServicesType;
}