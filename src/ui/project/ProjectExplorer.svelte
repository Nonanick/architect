<script lang="ts">
  import type { ProjectDTO } from "../../lib/project/new-project.interface";
  import SvgImage from "../components/SVGImage.svelte";
  import { AppRouter } from "../router/AppRouter";

  export let projectPath: string;
  export let projectName : string;

  export let queryParams: any = {};

  let projectInfo: ProjectDTO;

  $: {
    if ((projectPath == null || projectPath == "") && projectInfo != null) {
      projectPath = projectInfo.root;
    }

    if((projectName == null || projectName == "") && projectInfo != null) {
      projectName = projectInfo.name;
    }
  }

  if (queryParams.name != null) {
    // find project location from tracked projects
    architect.Server.get(`project/tracked/${encodeURI(queryParams.name)}`)
      .then((info) => {
        console.log("Project info:", info);
        projectPath = info.root;
        projectInfo = info;
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
        projectInfo = info;
      })
      .catch((err) => {
        console.error("Error while loading project: ", err);
        alert("Failed to load project!\nIs it an Architect project?");
      });
  }

</script>

<div class="">Exploring a new project!</div>
<main class="page project-explorer-page">
  <sector class="header">
    <div
      class="go-back"
      on:click={() => {
        AppRouter.navigateTo("/");
      }}
    >
      <SvgImage
        src="/img/architect.logo.svg"
        color="var(--secondary-color)"
        size="30px"
      />
    </div>
    <div class="title">
      <div class="inline-align-center"> 
      <SvgImage
        src="/img/icons/project.svg"
        color="var(--main-color)"
        size="24pt"
      />
      </div>
      {projectInfo?.title ?? "Loading project..."}
    </div>
  </sector>
  <sector class="body">
    <nav class="side-menu">
      
    </nav>
    <sector class="content-viewport">
    Project explorer! <br />
    Will now explore project located at: {projectPath}
    </sector>
  </sector>
</main>

<style>
  .project-explorer-page {
    --header-height: 40px;
    --top-paddding: 5px;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--main-bg-color);
  }

  .header {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    display: grid;
    grid-template-columns: 40px auto 1fr 120px;
    column-gap: 20px;
    height: 40px;
    padding: 5px 10px;
  }

  .header .title {
    font-size: 18pt;
    font-weight: bold;
    line-height: 40px;
  }

  .go-back {
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.4s;
  }

  .go-back:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .go-back:active {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .body {
    --body-top: calc(var(--header-height) + (var(--top-paddding) * 2));
    position: absolute;
    top: var(--body-top);
    width: 100%;
    height: calc(100% - var(--body-top));
    padding: 5px 10px;
    width: 100%;
    left: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
</style>
