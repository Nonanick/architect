import { ArchitectServices as Services, InjectServices } from "../services/inject_services";

InjectServices(window);

type ArchitectServicesType = ReturnType<typeof Services>;

declare global {
  

  interface Window {
    Architect: typeof Services;
  }

  var Architect : ArchitectServicesType;
}

