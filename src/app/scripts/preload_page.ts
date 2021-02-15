import { Buffer as NodeBuffer} from 'buffer';
import { ArchitectServices as Services, InjectServices } from "../services/inject_services";

if(window.exports == null)
  window.exports = {};
  
window.Buffler = NodeBuffer;
InjectServices(window);

type ArchitectServicesType = typeof Services;

var architect = Services;
var Buffler = NodeBuffer;
console.log('Buffer =>', Buffer);

declare global {

  interface Window {
    architect: typeof Services;
    Buffler : typeof NodeBuffer;
    Buffer : typeof NodeBuffer;
  }

  interface globalThis {
    architect: typeof Services;
  }

  var architect: ArchitectServicesType;
}