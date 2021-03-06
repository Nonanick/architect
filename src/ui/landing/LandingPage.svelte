<script lang="ts">
	import { AppRouter } from "../router/AppRouter";
	import SVGImage from "../components/SVGImage.svelte";
	import RecentProject from "./components/RecentProject.svelte";
	import SvgImage from "../components/SVGImage.svelte";
	import { fade } from "svelte/transition";
	import IconButton from "../components/form/icon-button/IconButton.svelte";
	import { TrackedProjects } from "../storage/TrackedProjects";
	import RadioSlider from "../components/form/radio-slider/RadioSlider.svelte";
	import type { RadioSliderOptionProps } from "../components/form/radio-slider/RadioSliderOptionProps";
	import { OpenProject } from "../storage/OpenProject";

	let themeConfig = architect.Server.get("config/theme")
		.then((v) => String(v))
		.catch((err) => {
			console.error(err);
		});

	let workspaceConfig = architect.Server.get("config/workspace")
		.then(async (dW: string) => {
			return dW;
		})
		.catch((err) => {
			console.error(err);
			return "";
		});

	// Server defined? Put up variable definitions togheter with the theme metadata and voila?
	const themeSliderOptions: RadioSliderOptionProps[] = [
		// Light theme
		{
			label: "Light",
			value: "light",
			icon: "/img/icons/theme.light.svg",
			active_color: {
				bg: "white",
				fg: "#BD632F",
			},
		},
		// Dark theme
		{
			label: "Dark",
			value: "dark",
			icon: "/img/icons/theme.dark.svg",
			active_color: {
				bg: "#202030",
				fg: "#D5F2E3",
			},
		},
	];

	function handleSliderChange(ev: CustomEvent) {
		console.log("HandleSliderChnage", ev);
		let newTheme =
			String((ev.detail.srcElement as HTMLInputElement).value) ?? "light";
		architect.Server.patch("config/theme/" + newTheme).then((_) => {
			themeConfig = Promise.resolve(newTheme);
		});
	}

	function handlePickLocationForWorkspace() {
		window.architect.FileSystem.pickFolder(defaultWorkspace)
			.then((newLocation) => {
				defaultWorkspace = String(newLocation);
				updateWorkspace();
			})
			.catch((failed) => {
				console.error("Failed to open directory", failed);
			});
	}

	function handleResetWorkspaceConfiguration() {
		architect.Server.patch("config/workspace")
			.then((resettedValue) => {
				defaultWorkspace = String(resettedValue);
				workspaceConfig = Promise.resolve(resettedValue);
			})
			.catch((err) => {
				console.error("Failed to reset workspace default value!", err);
			});
	}

	workspaceConfig.then((v) => (defaultWorkspace = v));

	let defaultWorkspace: string;

	async function selectArchitectProject(initialDir?: string) {
		let folderPath = await architect.FileSystem.pickFolder(initialDir);
		AppRouter.navigateTo("project-explorer?path=" + encodeURI(folderPath));
	}

	function createArchitectProject() {
		AppRouter.navigateTo("new-project");
	}

	function updateWorkspace() {
		architect.Server.post("config/workspace", {
			value: defaultWorkspace,
		});
		workspaceConfig = Promise.resolve(defaultWorkspace);
	}
</script>

<style>
	.architect-header {
		--header-size: 8vw;
		display: block;
		width: 100%;
		height: var(--header-size);
		min-height: 80px;
		display: grid;
		column-gap: 20px;
		grid-template-columns: minmax(80px, var(--header-size)) 1fr minmax(
				280px,
				25vw
			);
		grid-template-rows:
			minmax(56px, calc(var(--header-size) * 0.7))
			minmax(24px, calc(var(--header-size) * 0.3));
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
		color: var(--secondary-color);
	}

	.slogan-container {
		grid-column: 2 / 2;
		grid-row: 2 / 2;
		font-size: max(14px, 1.2vw);
		line-height: max(24px, 2vw);
		font-weight: 300;
	}

	.recently-open-title {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-auto-columns: auto;
		grid-auto-flow: column;
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
		font-size: max(11pt, 1.6vw);
	}

	.project-actions {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: row;
	}
	.project-actions div {
		margin-top: 10px;
		padding: 4px 10px;
		box-sizing: border-box;
		border-bottom: 1px solid var(--distress-color);
		cursor: pointer;
		background-color: transparent;
		transition: background-color 0.4s;
		width: 100%;
		text-align: left;
		margin-left: 5px;
		display: flex;
		align-items: center;
	}

	.project-actions div > :global(div) {
		margin-right: 10px;
	}

	.project-actions div:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.project-actions div:active {
		background-color: rgba(0, 0, 0, 0.2);
	}

	.customize-properties .item {
		margin-bottom: 5px;
		padding: 5px 0px;
		box-sizing: border-box;
	}

	.item .title {
		font-size: 10pt;
		font-weight: bold;
		border-top-left-radius: 3px;
		border-bottom-left-radius: 3px;
		margin-bottom: 5px;
	}

	.architect-tips {
		display: grid;
		grid-template-rows: 40px 1fr;
		row-gap: 20px;
	}

	.tip-slider {
		display: grid;
		grid-template-rows: auto 40px;
		row-gap: 10px;
	}

	.slide-container {
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 5px;
		box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.1);
		min-height: 40px;
		padding: 10px 15px;
		box-sizing: border-box;
		padding-bottom: 20px;
	}

	.slide-controller {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.slide-controller > div {
		margin: 0 8px;
		background-color: var(--secondary-color);
		color: var(--text-on-secondary-color);
		cursor: pointer;
		height: 30px;
		width: 30px;
		line-height: 30px;
		text-align: center;
		border-radius: 50%;
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

<main class="page" transition:fade>
	<section class="architect-header">
		<div class="logo-container">
			<div class="app-logo">
				<div class="logo-background">
					<SVGImage src="/img/architect.logo.svg" color="white" size="90%" />
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
			<div class="create-project" on:click={() => createArchitectProject()}>
				<SvgImage
					src="/img/icons/create.project.svg"
					color="var(--main-color)"
				/>
				New project
			</div>
			<div class="open-project" on:click={() => selectArchitectProject()}>
				<SvgImage src="/img/icons/open.project.svg" color="var(--main-color)" />
				Open
			</div>
		</div>
	</section>
	<section class="architect-body">
		<div class="customize-properties">
			<div class="properties-title">
				<h3>Configurations</h3>
			</div>
			<div class="item">
				<div class="title">Theme</div>
				<div class="setter">
					{#await themeConfig}
						... loading theme
					{:then theme}
						<RadioSlider
							value={String(theme ?? "light")}
							name="theme"
							options={themeSliderOptions}
							showLabels={false}
							on:change={(ev) => handleSliderChange(ev)}
						>
							{themeSliderOptions.filter(
								(o) => o.value === String(theme ?? "light")
							)[0].label}
						</RadioSlider>
					{/await}
				</div>
			</div>
			<div class="item">
				<div class="title">Workspace</div>
				<div class="setter">
					{#await workspaceConfig}
						... loading workspace
					{:then workspace}
						<div class="input-container">
							<input
								type="text"
								class="text-input"
								name="default-workspace"
								bind:value={defaultWorkspace}
								on:change={() => updateWorkspace()}
							/>
							<IconButton
								label="Pick Location"
								icon={{ src: "/img/icons/pick.folder.svg" }}
								showLabel={false}
								on:click={handlePickLocationForWorkspace}
							/>
							<!-- svelte-ignore missing-declaration -->
							<IconButton
								icon={{ src: "/img/icons/reload.svg" }}
								on:click={handleResetWorkspaceConfiguration}
								label="reset value"
								showLabel={false}
							/>
						</div>
					{/await}
				</div>
			</div>
			<div class="item" />
		</div>
		<div class="recently-open">
			<div class="recently-open-title">
				<h3>Recently open</h3>

				<IconButton
					showLabel={false}
					icon={{
						src: "/img/icons/trash.svg",
						color: "var(--error-color)",
					}}
					label="Empty recent projects"
					on:click={async () => {
						if (
							confirm(
								"Are you sure you want to delete all recently tracked projects?"
							)
						) {
							TrackedProjects.truncate();
						}
					}}
				/>
			</div>
			{#if $TrackedProjects.length === 0}
				No recent project avaliable!
			{/if}
			{#each $TrackedProjects as project}
				<RecentProject
					on:dblclick={() => {
						$OpenProject = project;
						AppRouter.navigateTo("project-explorer");
					}}
					projectInfo={project}
				/>
			{/each}
		</div>
		<div class="architect-tips">
			<div class="tips-title">
				<h3>Did you know?</h3>
			</div>
			<div class="tip-slider">
				<div class="slide-container">
					Creating the form pieces and then using them instead of breaking your
					chain of tought each time you need an specific input type is actually
					better?<br />
					Try it before implementing subform / item form for entities!
				</div>
				<div class="slide-controller">
					<div class="previous">&lt;</div>
					<div class="next">&gt;</div>
				</div>
			</div>
		</div>
	</section>
</main>
