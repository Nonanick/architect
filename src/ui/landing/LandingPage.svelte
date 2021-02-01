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
		<div class="project-actions">
			<div class="create-project">Create a new project</div>
			<div class="open-project">Open a new project</div>
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
				<h3>Did you knowa?</h3>
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
		--header-size : 8vw;
		display: block;
		width: 100%;
		height: var(--header-size);
		min-height: 80px;
		display: grid;
		column-gap: 20px;
		grid-template-columns: minmax(80px, var(--header-size)) 1fr 200px;
		grid-template-rows: minmax(56px, calc(var(--header-size) * 0.7)) minmax(24px, calc(var(--header-size) * 0.3));
	}
	.logo-container {
		grid-column: 1 / 2;
		grid-row: 1 / 3;
		position: relative;
		display: flex;
	}
	.app-logo {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.project-actions {
		grid-column: 3 / 4;
		grid-row: 1 / 3;
		display: flex;
		justify-items: flex-end;
		align-items: flex-end;
		flex-direction: column;
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
		font-size: max(40px, calc(var(--header-size) * 0.45));
		line-height: max(56px, calc(var(--header-size) * 0.8));
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
		box-sizing: border-box;
		display: grid;
		column-gap: 15px;
		grid-template-columns: 250px minmax(250px, 1fr) 250px;
		grid-template-rows: auto;
		padding-bottom: 20px;
	}

.architect-body h3 {
	font-weight: 600;
	font-size: 1.3vw;
}
	@media only screen and (min-width: 768px) and (max-width: 1024px) {
		.architect-body {
			grid-template-columns: minmax(250px, 1fr) 250px;
			grid-template-rows: auto;
			row-gap: 20px;
		}
		.customize-properties {
			grid-column: 1 / 2;
			grid-row: 2 / 3;
		}
		.architect-tips {
			grid-column: 2 / 3;
			grid-row: 1 / 3;
		}
	}

	@media only screen and (max-width: 768px) {
		.architect-body {
			row-gap: 20px;
			grid-template-columns: 1fr;
			grid-template-rows: auto;
		}
		.customize-properties {
			grid-column: 1 / 2;
			grid-row: 2 / 3;
		}
	}
</style>
