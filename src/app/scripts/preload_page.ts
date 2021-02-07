import { ArchitectServices, ArchitectServices as Services, InjectServices, MyWorld } from "../services/inject_services";

console.log('Preload ->', ArchitectServices.Server, MyWorld);

InjectServices(window);

type ArchitectServicesType = typeof Services;

declare global {

  interface Window {
    Architect: typeof Services;
  }

  var Architect : ArchitectServicesType;
}