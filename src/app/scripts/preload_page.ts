import { ArchitectServices as Services } from "../services/inject_services";

window.Architect = Services;

declare global {
  interface Window {
    Architect: typeof Services;
  }
}