import { ArchitectServices as Services } from "../services/inject_services";

window.Architect = Services;

type ArchitectServicesType = typeof Services;

declare global {
  

  interface Window {
    Architect: typeof Services;
  }

  var Architect : ArchitectServicesType;
}

