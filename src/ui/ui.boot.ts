import { AppRouter } from './router/AppRouter';
import Viewport from './Viewport.svelte';
import { BrowserServices } from '../app/services/browser/browser.services';
import type { ArchitectServices } from '../app/services/inject_services';
let app: Viewport;

(window as any).Buffer = (window as any).Buffler;

app = new Viewport({
	target: document.body,
	props: {
		router: AppRouter
	}
});

if(window.architect == undefined) {
	window.architect = BrowserServices as any;
}

export default app; 

declare global {

  interface Window {
    architect: typeof ArchitectServices;
  }

  interface globalThis {
    architect: typeof ArchitectServices;
  }
  var architect: typeof ArchitectServices;
}