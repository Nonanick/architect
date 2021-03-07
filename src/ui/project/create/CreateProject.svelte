<script lang="ts">
  import { Entity } from "clerk";
  import { fade, scale } from "svelte/transition";
  import { ProjectEntity } from "../../../lib/entity/ProjectEntity";
  import type { ProjectDTO } from "../../../lib/project/new_project.interface";
  import SvgImage from "../../components/SVGImage.svelte";
  import type { SVGImageProps } from "../../components/SVGImageProps";
  import { AppRouter } from "../../router/AppRouter";
  import { OpenProject } from "../../storage/OpenProject";
  import { TrackedProjects } from "../../storage/TrackedProjects";
  import CreateProjectItem from "../CreateProjectItem.svelte";
  import type { CreateProjectStep } from "../project.module";
  import { ProjectModule } from "../project.module";
  import AdvancedForm from "./AdvancedForm.svelte";
  import MainForm from "./MainForm.svelte";

  architect.Server.get("config/workspace")
    .then((w) => {
      workspace = w;
    })
    .catch((err) => {
      console.error("Failed to fetch workspace!", err);
    });

  export let packageName = "";
  export let title = "";
  export let description: string;
  export let workspace = "";
  export let version = "0.0.1";
  export let author = "";

  export let packageManager: "pnpm" | "npm" | "yarn" = "yarn";

  let collapseAdvancedGroup = true;

  let buttonState: {
    [name in typeof creationState]: {
      onClick: () => void;
      title: string;
      color?: string;
      icon?: SVGImageProps;
    };
  } = {
    create: {
      onClick: () => {
        createProject();
      },
      title: "Create Project!",
    },
    creating: {
      onClick: () => {},
      title: "Creating your project",
      icon: { src: "/img/icons/status.pending.svg" },
    },
    done: {
      onClick: () => {
        AppRouter.navigateTo("/project-explorer");
      },
      title: "Done! Open your new project!",
    },
    failed: {
      onClick: () => {
        createProjectSteps = [];
        creationState = "create";
      },
      title: "Failed! Reopen Form",
    },
  };

  architect.Server.get("config/username")
    .then((user) => {
      if (author === "" || author == null) author = user;
    })
    .catch((err) => {
      console.error("Failed to get default user!", err);
    });

  let creationState: "create" | "creating" | "done" | "failed" = "create";

  type ProjectCreationStep = {
    title: string;
    status: "pending" | "processing" | "done" | "error";
    output?: string;
  };

  let createProjectSteps: ProjectCreationStep[] = [];

  async function createProject() {
    if (creationState !== "create") return;

    creationState = "creating";
    let projectEntity = Entity.instance<ProjectDTO>(ProjectEntity);

    let newProject = projectEntity.model();

    newProject.$set({
      name: packageName,
      author,
      created_at: new Date(Date.now()),
      root: architect.FileSystem.joinPath(
        workspace,
        ProjectModule.convertPackageNameToFolderPath(packageName)
      ),
      title,
      description,
      version,
    });

    let validValues = await newProject.$commit();

    if (validValues instanceof Error) {
      alert("Failed to validate project information!");
      creationState = "failed";
      return;
    }

    let projectData = validValues as ProjectDTO;

    let createProjectGen = ProjectModule.createProject(projectData);
    let createProjectStep: IteratorResult<CreateProjectStep>;

    while ((createProjectStep = createProjectGen.next())) {
      if (createProjectStep.done) {
        console.log(createProjectStep.value);
        break;
      }
      let newStep: ProjectCreationStep = {
        title: createProjectStep.value.title,
        status: "processing",
      };

      createProjectSteps = [...createProjectSteps, newStep];

      try {
        await createProjectStep.value.resolved
          .then((done: string) => {
            console.log("Its done!", done);
            newStep.status = "done";
            newStep.output = done;
          })
          .catch((err: string) => {
            console.log("Error while creating project!", err);
            newStep.status = "error";
            newStep.output = err;
            return Promise.reject(err);
          })
          .finally(() => {
            createProjectSteps = createProjectSteps;
          });
      } catch (err) {
        creationState = "failed";
        console.error("Failed to create project", err);
        return;
      }
    }

    creationState = "done";

    $OpenProject = projectData;
    TrackedProjects.update((projects) => {
      projects.push(projectData as ProjectDTO);
      return projects;
    });

    promptToOpenProject(projectData);
  }

  function promptToOpenProject(project: ProjectDTO) {
    if ( confirm(
        `Would you like to open the project ${project.title ?? project.name}?`
      ) ) {
      AppRouter.navigateTo("project-explorer?name=" + encodeURI(project.name));
    }
  }
</script>

<style>
  .create-project-page {
    --header-height: 40px;
    --top-paddding: 5px;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .header {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    display: grid;
    grid-template-columns: 40px 1fr 120px;
    height: 40px;
    padding: 5px 10px;
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

  .navigation {
    display: flex;
    align-items: center;
    column-gap: 20px;
    padding: 0 20px;
  }

  .navigation-item {
    display: flex;
    align-items: center;
    padding: 3px 10px;
    background-color: transparent;
    transition: background-color 0.4s;
  }

  .navigation-item > :global(div) {
    margin-right: 10px;
  }

  .navigation-item:hover:not(.active) {
    text-decoration: underline;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border-radius: 3px;
  }

  .body {
    --body-top: calc(var(--header-height) + (var(--top-paddding) * 2));
    position: absolute;
    top: var(--body-top);
    left: 0px;
    width: 100%;
    min-height: calc(100% - var(--body-top));
    height: auto;
    padding: 5px 10px;
    width: 80vw;
    left: 10vw;
    box-sizing: border-box;
  }

  .form-header {
    position: relative;
    width: 100%;
    height: auto;
    display: grid;
    grid-column: 1 / span 2;
    grid-template-columns: 1fr 80px;
    grid-template-rows: auto;
    font-size: max(16pt, 3vw);
    height: 80px;
    line-height: 80px;
    box-sizing: border-box;
    padding: 0 20px;
  }

  .form-progress {
    text-align: right;
  }

  .form-container {
    position: relative;
    width: 100%;
    height: auto;
    display: grid;
    grid-column: 1 / span 1;
    column-gap: 20px;
    row-gap: 20px;
    background-color: white;
    box-sizing: border-box;
    padding: 20px 20px;
    box-shadow: 0px 0px 4px 1px rgb(0 0 0 / 10%);
    border-radius: 4px;
  }

  .button {
    width: auto;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: var(--main-color);
    margin-top: 20px;
    color: white;
    cursor: pointer;
  }
  .create-project.button {
    position: relative;
    width: auto;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: var(--main-color);
    margin-top: 20px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
  }

  .create-project.button:hover {
    opacity: 0.85;
  }

  .create-project.button:active {
    opacity: 1;
  }

  .create-project-progress {
    position: relative;
    top: 0px;
    width: 100%;
    height: auto;
    border-radius: 4px;
    z-index: 2;
    backdrop-filter: blur(3px);
    pointer-events: none;
    transition: height 0.4s;
    box-sizing: border-box;
    margin-top: 20px;
    padding-bottom: 20px;
  }

  .form-group {
    position: relative;
    height: auto;
  }
  .form-group.collapsed {
    height: 30px;
    overflow: hidden;
  }
  .form-group.collapsed .collapse {
    transform: rotate(0deg);
  }
  .form-group .title {
    position: relative;
    width: 100%;
    height: 30px;
    line-height: 30px;
  }
  .form-group > .collapse {
    position: absolute;
    top: 5px;
    right: 5px;
    transform: rotate(180deg);
    transition: transform 0.4s;
  }
</style>

<main class="create-project-page page" transition:fade>
  <sector class="header">
    <div
      class="go-back"
      on:click={() => {
        AppRouter.navigateTo("/");
      }}
    >
      <SvgImage
        src="/img/icons/back.svg"
        color="var(--secondary-color)"
        size="30px"
      />
    </div>
    <div class="navigation">
      <div
        class="navigation-item"
        on:click={() => {
          AppRouter.navigateTo("/");
        }}
      >
        <SvgImage src="/img/architect.logo.svg" color="var(--main-color)" />
        Home
      </div>
    </div>
  </sector>

  <sector class="body">
    <div class="form-header">
      <div class="form-title">
        <SvgImage
          src="/img/icons/create.project.svg"
          color="var(--secondary-color)"
          size="40px"
        />
        Create Project
      </div>
      <div class="form-progress">
        <div class="progress-indicator">
          <div class="progress-bg" />
          <div class="progress-center" />
        </div>
      </div>
    </div>
    {#if creationState === "create"}
      <div class="form-container" transition:scale={{ duration: 0.4 }}>
        <MainForm
          bind:packageName
          bind:title
          bind:description
          bind:author
          bind:version
          bind:workspace
        />
        <div class="form-group" class:collapsed={collapseAdvancedGroup}>
          <div class="title">Advanced</div>
          <div
            class="collapse clickable"
            on:click={() => {
              collapseAdvancedGroup = !collapseAdvancedGroup;
            }}
          >
            <SvgImage
              src="/img/icons/arrow.svg"
              color="rgba(0,0,0,0.4)"
              size="16px"
            />
          </div>
          <AdvancedForm bind:packageManager />
        </div>
      </div>
    {/if}
    <div
      class="create-project button clickable"
      style="background-color: {buttonState[creationState].color ??
        'var(--main-color)'}"
      on:click={() => buttonState[creationState].onClick()}
    >
      {buttonState[creationState].title}
    </div>
    {#if creationState !== "create"}
      <div
        class="create-project-progress"
        transition:scale={{ delay: 0.4, duration: 0.4 }}
      >
        {#each createProjectSteps as step}
          <CreateProjectItem
            title={step.title}
            status={step.status}
            output={step.output}
          />
        {/each}
      </div>
      {#if creationState === "done"}
        <div
          class="clickable button"
          style="font-weight: bold;"
          on:click={() => {
            AppRouter.navigateTo("project-explorer");
          }}
        >
          Open this project in Project Explorer!
        </div>
      {/if}
    {/if}
  </sector>
</main>
