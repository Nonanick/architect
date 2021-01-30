import { AppRouter } from '../ui/router/AppRouter';
import Viewport from '../ui/Viewport.svelte';

let app: Viewport;

app = new Viewport({
	target: document.body,
	props: {
		router: AppRouter
	}
});

export default app; 