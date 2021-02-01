import { AppRouter } from './router/AppRouter';
import Viewport from './Viewport.svelte';

let app: Viewport;

app = new Viewport({
	target: document.body,
	props: {
		router: AppRouter
	}
});

window.Architect.Server.get("config/bootCount")
	.then(resp => {
		console.log("Response: ", resp);
		let count = resp ?? 0;
		window.Architect.Server.patch("config/bootCount/" + ++count);
	})
	.catch(err => {
		console.error("Failed to get from architect", err);
	});

export default app; 