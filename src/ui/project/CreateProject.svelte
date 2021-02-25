<script lang="ts">
  import { Entity } from "clerk";
  import { fade, scale } from "svelte/transition";
  import { ProjectEntity } from "../../lib/entity/ProjectEntity";
  import type { ProjectDTO } from "../../lib/project/new-project.interface";
  import IconButton from "../components/form/icon-button/IconButton.svelte";
  import TextArea from "../components/form/text-area/TextArea.svelte";
  import TextInput from "../components/form/text-input/TextInput.svelte";
  import SvgImage from "../components/SVGImage.svelte";
  import { AppRouter } from "../router/AppRouter";
  import CreateProjectItem from "./CreateProjectItem.svelte";
  import type { CreateProjectStep } from "./project.module";
  import { ProjectModule } from "./project.module";

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

  architect.Server.get("config/username")
    .then((user) => {
      if (author === "" || author == null) author = user;
    })
    .catch((err) => {
      console.error("Failed to get default user!", err);
    });

  let keepTitleInSync = true;

  let onCreationProcess: "create" | "creating" | "done" | "failed" = "create";

  type ProjectCreationStep = {
    title: string;
    status: "pending" | "processing" | "done" | "error";
    output?: string;
  };

  let createProjectSteps: ProjectCreationStep[] = [];

  async function createProject() {
    if (onCreationProcess !== "create") return;

    onCreationProcess = "creating";
    let projectEntity = new Entity<ProjectDTO>(ProjectEntity);

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
      onCreationProcess = "failed";
      setTimeout(() => {
        createProjectSteps = [];
        onCreationProcess = "create";
      }, 5000);
      return;
    }

    let createProjectGen = ProjectModule.createProject(validValues);
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
        onCreationProcess = "failed";
        setTimeout(() => {
          createProjectSteps = [];
          onCreationProcess = "create";
        }, 5000);
        return;
      }
    }

    onCreationProcess = "done";

    promptToOpenProject(newProject);
  }

  function promptToOpenProject(project: ProjectDTO) {
    if (
      confirm(
        `Would you like to open the project ${project.title ?? project.name}?`
      )
    ) {
      AppRouter.navigateTo("project-explorer?name=" + encodeURI(project.name));
    } else {
      AppRouter.navigateTo("/");
    }
  }

  function sleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), time);
    });
  }

  function syncTitle() {
    if (keepTitleInSync) {
      title = ProjectModule.convertPackageNameToTitle(packageName);
    }
  }

  function verifyIdentifier() {
    packageName = ProjectModule.sanitizePackageName(packageName);
  }
</script>

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
    {#if onCreationProcess === "create"}
      <div class="form-container" transition:scale={{ duration: 0.4 }}>
        <TextInput
          class="input"
          name="identifier"
          required
          bind:value={packageName}
          on:keyup={() => {
            packageName = packageName.toLocaleLowerCase();
            verifyIdentifier();
            syncTitle();
          }}
        >
          Package Name:
          <div slot="label-icon">
            <SvgImage src="/img/icons/medal.svg" size="20px" />
          </div>
          <slot slot="input-button">
            <IconButton
              label={(keepTitleInSync ? "( ON )" : "( OFF )") +
                " Synchronize title with package name"}
              icon={{
                src: "/img/icons/sync.svg",
                color: keepTitleInSync ? "green" : "var(--error-color)",
              }}
              showLabel={false}
              on:click={() => {
                if (keepTitleInSync) {
                  keepTitleInSync = false;
                } else {
                  keepTitleInSync = true;
                  syncTitle();
                }
              }}
            />
          </slot>
        </TextInput>

        <TextInput
          class="input"
          name="title"
          bind:value={title}
          on:input={() => {
            keepTitleInSync = false;
          }}
        >
          Title:
        </TextInput>
        <div class="col-2">
          <TextInput class="input" name="author" bind:value={author}>
            Author:
          </TextInput>

          <TextInput class="input" name="version" bind:value={version}>
            Version:
          </TextInput>
        </div>

        <TextArea bind:value={description} name="description">
          Description:
        </TextArea>

        <TextInput
          class="input"
          name="workspace"
          bind:value={workspace}
          validate={async (value) => {
            return value.length > 0 ? true : "Cannot be empty!";
          }}
        >
          Location:
          <div slot="label-icon">
            <SvgImage src="/img/icons/folder.location.svg" size="25px" />
          </div>
          <slot slot="input-button">
            <IconButton
              label="Pick Location"
              icon={{ src: "/img/icons/pick.folder.svg" }}
              showLabel={false}
              on:click={() => {
                window.architect.FileSystem.pickFolder()
                  .then((newLocation) => {
                    workspace = String(newLocation);
                  })
                  .catch((failed) => {
                    console.error("Failed to open directory", failed);
                  });
              }}
            />
          </slot>
        </TextInput>
      </div>
    {/if}
    <div class="create-project button" on:click={() => createProject()}>
      {onCreationProcess.charAt(0).toLocaleUpperCase() +
        onCreationProcess.substr(1)}
    </div>
    {#if onCreationProcess !== "create"}
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
    {/if}
  </sector>
</main>

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
    height: calc(100% - var(--body-top));
    padding: 5px 10px;
    width: 60vw;
    left: 20vw;
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

  .form-container > :global(.input) {
    position: relative;
    width: 100%;
    min-height: 80px;
    height: auto;
  }

  .create-project.button {
    position: relative;
    grid-column: 1 / span 2;
    width: 200px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin-left: calc(50% - 100px);
    background-color: var(--main-color);
    margin-top: 20px;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    opacity: 0.8;
    will-change: opacity;
    transition: opacity 0.4s;
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

  .col-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;
  }
  @media screen and (max-width: 700px) {
    .form-container .input {
      flex: 100%;
    }
  }
</style>
