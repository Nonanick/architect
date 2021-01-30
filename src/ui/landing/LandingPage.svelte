<script lang="ts">
	import { AppRouter } from "../router/AppRouter";
	import SVGImage from "../components/SVGImage.svelte";
	import RecentProject from "./components/RecentProject.svelte";
	import type RecentProjectType from "./components/RecentProjectType";

	const recentProjects: RecentProjectType[] = [
		{
			title: "Testing Svelte Project",
			author: "Nicholas Frai",
			version: "0.0.1",
			description: "very testy testing project",
			project_root: "/architect/workspace/test-svelte-project",
			created_at: new Date(Date.now() - 60 * 60 * 24 * 8),
		},
		{
			title: "Another project",
			author: "Nicholas Frai",
			version: "0.0.1",
			project_root: "/architect/workspace/another-project",
			created_at: new Date(Date.now() - 60 * 60 * 24 * 60),
		},
	];

	function selectArchitectProject(initialDir?: string) {
		alert("Ok! Select Project!");
	}

	function createArchitectProject(initialDir?: string) {
		AppRouter.navigateTo("new-project");
	}
</script>

<main>
	<section class="architect-header">
		<div class="logo-container">
			<div class="app-logo">
				<div class="logo-background">
					<SVGImage
						src="/img/architect.logo.svg"
						color="white"
						size="90%"
						ratio={1}
					/>
				</div>
			</div>
		</div>
		<div class="title-container">
			<span class="title"> Architect </span>
		</div>
		<div class="slogan-container">
			<div class="slogan">simple, yet powerful</div>
		</div>
	</section>
	<section class="architect-body">
		<div class="customize-properties">
			<div class="properties-title">
				<h3>Properties</h3>
			</div>
			<div class="item">Theme</div>
			<div class="item">Workspace</div>
			<div class="item" />
		</div>
		<div class="recently-open">
			<div class="recently-open-title">
				<h3>Recently open</h3>
			</div>
			{#if recentProjects.length === 0}
				No recent project avaliable!
			{/if}
			{#each recentProjects as project}
				<RecentProject {...project} />
			{/each}
		</div>
		<div class="architect-tips">
			<div class="tips-title">
				<h3>Did you know?</h3>
			</div>
			<div class="tip-slider">
				<div class="slide-container" />
				<div class="slide-controller">
					<div class="previous">&lt;</div>
					<div class="next">&gt;</div>
				</div>
			</div>
		</div>
	</section>
</main>

<style>
	.architect-header {
		display: block;
		width: 100%;
		height: 10vw;
		min-height: 80px;
		display: grid;
		column-gap: 20px;
		grid-template-columns: minmax(80px, 10vw) 1fr;
		grid-template-rows: minmax(56px, 7vw) minmax(24px, 3vw);
	}
	.logo-container {
		grid-column: 1 / 1;
		grid-row: 1 / 3;
		position: relative;
		display: flex;
	}
	.app-logo {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.logo-background {
		border-radius: 50%;
		position: relative;
		width: 90%;
		height: 90%;
		margin: 5%;
		background-color: var(--main-color);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.title-container {
		grid-column: 2 / 2;
		grid-row: 1 / 1;
		font-size: max(40px, 4.5vw);
		line-height: max(56px, 8vw);
		font-weight: bold;
		color: var(--main-color);
	}

	.slogan-container {
		grid-column: 2 / 2;
		grid-row: 2 / 2;
		font-size: max(14px, 1.2vw);
		line-height: max(24px, 2vw);
		font-weight: 300;
	}

	.architect-body {
		display: grid;
		grid-template-columns: 250px minmax(250px, 1fr) 250px;
		grid-template-rows: auto;
	}
</style>
