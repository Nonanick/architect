import { AppRouter } from './router/AppRouter';
import Viewport from './Viewport.svelte';
import { BrowserServices } from '../app/services/browser/browser.services';
import type { ArchitectServices } from '../app/services/inject_services';

let app: Viewport;

(window as any).Buffer = (window as any).Buffler;
console.log('Window as Buffer -> ', (window as any).Buffer);

app = new Viewport({
	target: document.body,
	props: {
		router: AppRouter
	}
});

if(window.architect == undefined) {
	window.architect = BrowserServices as any;
}

console.log('Server ->', window.architect);

window.architect.Server.get("config/bootCount")
	.then(resp => {
		console.log("Response: ", resp);
		let count = resp ?? 0;
		window.architect.Server.patch("config/bootCount/" + ++count);
	})
	.catch(err => {
		console.error("Failed to get from architect!", err);
	});


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