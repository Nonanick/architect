import { AppRouter } from './router/AppRouter';
import Viewport from './Viewport.svelte';
import { setContext } from 'svelte';
import { BrowserServices } from '../app/services/browser/browser.services';

let app: Viewport;

app = new Viewport({
	target: document.body,
	props: {
		router: AppRouter
	}
});

if(window.Architect == undefined) {
	window.Architect = BrowserServices as any;
}

window.Architect.Server.get("config/bootCount")
	.then(resp => {
		console.log("Response: ", resp);
		let count = resp ?? 0;
		window.Architect.Server.patch("config/bootCount/" + ++count);
	})
	.catch(err => {
		console.error("Failed to get from architect!", err);
	});


export default app; 