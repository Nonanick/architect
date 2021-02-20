<script lang="ts">
  import SvgImage from "../../components/SVGImage.svelte";
  import { AppRouter } from "../../router/AppRouter";
  import { OpenProject } from "../../storage/OpenProject";
  import { ProjectExplorerActivities } from "./ExplorerActivities";
  import SideMenu from "./side-menu/SideMenu.svelte";

  export let projectPath: string;
  export let projectName: string;

  export let queryParams: any = {};

  export let urlParams: any = {};

  $: {
    projectPath = $OpenProject?.root;
    projectName = $OpenProject?.name;
  }

  if (queryParams.name != null) {
    // find project location from tracked projects
    architect.Server.get(`project/tracked/${encodeURI(queryParams.name)}`)
      .then((info) => {
        console.log("Project info:", info);
        projectPath = info.root;
        $OpenProject = info;
      })
      .catch((err) => {
        console.error(
          "Failed to retrieve project information using its name!",
          err
        );
      });
  } else if (queryParams.path != null) {
    projectPath = queryParams.path;
    architect.Server.post(`project/analyze`, { target: projectPath })
      .then((info) => {
        $OpenProject = info;
      })
      .catch((err) => {
        console.error("Error while loading project: ", err);
        alert("Failed to load project!\nIs it an Architect project?");
      });
  }

  export let defaultActivity: keyof typeof knownActivities = "project-analysis";
  export const knownActivities = ProjectExplorerActivities;
</script>

<style>
  .project-explorer-page {
    --header-height: 40px;
    --top-paddding: 10px;
    position: absolute;
    display: grid;
    grid-template-rows: 40px 1fr;
    grid-template-columns: 280px 1fr;
    column-gap: 30px;
    row-gap: 20px;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    padding: 15px 20px;
    box-sizing: border-box;
  }

  .header {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    top: 0px;
    left: 0px;
    width: 100%;
    display: grid;
    grid-template-columns: 40px 230px;
    column-gap: 10px;
    height: 40px;
  }

  .header .title {
    font-size: 20pt;
    font-weight: 700;
  }

  .go-back {
    background-color: var(--secondary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.4s;
  }

  .go-back:hover {
    filter: brightness(95%);
  }

  .go-back:active {
    filter: brightness(80%);
  }

  .body {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
    position: relative;
    top: 0px;
    width: 100%;
    height: 100%;
    left: 0;
    box-sizing: border-box;
    overflow: hidden;
    display: grid;
    grid-template-columns: calc(40px + 10px + 230px) 1fr;
    grid-template-rows: 1fr;
    column-gap: 30px;
    box-shadow: inset 2px 2px 5px 1px rgba(0, 0, 0, 0, 0.05);
  }

  .side-menu {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    position: relative;
    top: 0px;
    width: 100%;
    height: 100%;
    left: 0;
  }
  .side-menu-separator {
    position: absolute;
    transform: rotate(-90deg);
    width: calc(100vh - 10px);
    height: 5px;
    top: 50vh;
    left: calc(20px + 280px + 30px - 50vh);
    user-select: none;
    pointer-events: none;
    opacity: 0.6;
  }
</style>

<main class="page project-explorer-page">
  <sector class="header">
    <div
      class="go-back"
      on:click={() => {
        AppRouter.navigateTo("/");
      }}
    >
      <SvgImage
        src="/img/icons/back.svg"
        color="var(--text-on-secondary-color)"
        size="36px"
      />
    </div>
    <div class="title">
      project explorer
      <div
        class="inline-align-center"
        style="margin-left: 10px;display: inline;"
      >
        <SvgImage
          src="/img/icons/project.svg"
          color="var(--main-color)"
          size="24pt"
        />
      </div>
    </div>
  </sector>
  <sector class="side-menu">
    <SideMenu />
  </sector>
  <img
    src="/img/fx/shadow.png"
    class="side-menu-separator"
    alt="shadow dividing the side menu and the main content"
  />
  <sector class="body">
    <svelte:component
      this={knownActivities[urlParams.activity] ??
        knownActivities[defaultActivity]}
      {queryParams}
      {urlParams}
    />
  </sector>
</main>
