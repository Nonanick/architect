import { Buffer as NodeBuffer } from 'buffer';
import { ArchitectServices as Services, InjectServices } from "../services/inject_services";

if (window.exports == null)
  window.exports = {};

InjectServices(window);

type ArchitectServicesType = typeof Services;

var architect = Services;
var Buffler = NodeBuffer;
var process = {
  env: {}
};

window.Buffer = NodeBuffer;
window.process = process;

declare global {

  interface Window {
    architect: typeof Services;
    Buffer: typeof NodeBuffer;
    process: any;
  }

  interface globalThis {
    architect: typeof Services;
  }

  var architect: ArchitectServicesType;
}