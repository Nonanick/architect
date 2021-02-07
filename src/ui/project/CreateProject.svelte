<script lang="ts">
  import SvgImage from "../components/SVGImage.svelte";
  import { AppRouter } from "../router/AppRouter";
  import { fade } from "svelte/transition";
  import TextInput from "../components/form/TextInput.svelte";
  import { ProjectModule } from "./project.module";

  Architect.Server.get("project/default-workspace")
    .then((w) => {
      workspace = w;
    })
    .catch((err) => {
      console.error("Failed to fetch default workspace!", err);
    });

  let identifier = "";
  let title = "";
  let description;
  let workspace = "";

  let keepTitleInSync = true;

  let showProgress = false;

  function createProject() {
    showProgress = true;

    Architect.Server.post("project/create", {
      identifier,
      workspace,
      title,
      description,
    }).then(async (answer) => {});
  }

  function syncTitle() {
    if (keepTitleInSync) {
      title = ProjectModule.convertPackageNameToTitle(identifier);
    }
  }

  function verifyIdentifier() {
    identifier = ProjectModule.sanitizePackageName(identifier);
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
    <div class="form-container">
      <div class="create-project-progress {showProgress ? 'visible' : ''}">
        <pre>

========================== Architect New Project ===============================
--------------------------------------------------------------------------------

[New Project]: Creating new project entitled 'New Project'!
  - name : new-project
  - versioned/version : yes - 0.0.1
  - stored in : /path/to/project
  - architect version : 0.0.1
  - author : nicholas
  - license : MIT
  - creation time: now
  - private : y/n
        
[#1] - Create folder
  OK, Architect could create project folder on the desired Location

[#2] - Install architect
  1. OK, Architect metadata about the project was installed on folder '.architect'
  2. Project's Architect control database was created succesfully!
  3. Architect's dependencies were installed!

[#3] - Create project template
  1. Created common backed login
  2. Created Svelte UI folder and scripts

[#4] - Configure project
  1. Changing project template to the desired configurations

[#5] - Install project dependencies
  Running script with 'pnpm'!
    -- Pnpm output:
    [...pnpm install dependecies output!]
  OK, no errors while installing dependencies!

[#6] - Openning project!
  Preparing project to be editted on Architect!

      </pre>
      </div>

      <TextInput
        class="input"
        name="identifier"
        bind:value={identifier}
        on:keyup={() => {
          identifier = identifier.toLocaleLowerCase();
          verifyIdentifier();
          syncTitle();
        }}
        inputButtons={[
          {
            label:
              (keepTitleInSync ? "( ON )" : "( OFF )") +
              " Synchronize title with package name",
            icon: {
              src: "/img/icons/sync.svg",
              color: keepTitleInSync ? "green" : "var(--error-color)",
            },
            showLabel: false,
            onClick: () => {
              if (keepTitleInSync) {
                keepTitleInSync = false;
              } else {
                keepTitleInSync = true;
                syncTitle();
              }
            },
          },
        ]}
      >
        Package Name:
        <div slot="label-icon">
          <SvgImage src="/img/icons/medal.svg" size="20px" />
        </div>
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

      <div class="input description">
        Description: <br />
        <textarea
          placeholder="Project description"
          bind:value={description}
          name="description"
        />
      </div>

      <TextInput
        class="input"
        name="workspace"
        bind:value={workspace}
        inputButtons={[
          {
            label: "Pick Location",
            icon: {
              src: "/img/icons/pick.folder.svg",
            },
            showLabel: false,
          },
        ]}
        validate={async (value) => {
          return value.length > 0 ? true : "Cannot be empty!";
        }}
      >
        Location:
        <div slot="label-icon">
          <SvgImage src="/img/icons/folder.location.svg" size="25px" />
        </div>
      </TextInput>
    </div>

    <div class="create-project button" on:click={() => createProject()}>
      Create!
    </div>
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
    overflow: hidden;
    background-color: var(--main-bg-color);
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
    display: grid;
    padding: 5px 10px;
    width: 60vw;
    left: 20vw;
    overflow: hidden;
    height: auto;
  }

  .form-header {
    position: relative;
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    font-size: 20pt;
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

  .input textarea {
    width: 100%;
    height: 100px;
    border-radius: 5px;
    margin-top: 4px;
    background-color: rgba(255, 255, 255, 0.6);
  }

  .create-project.button {
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
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    z-index: 2;
    backdrop-filter: blur(3px);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s;
    box-sizing: border-box;
    padding: 10px 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .create-project-progress.visible {
    opacity: 1;
    pointer-events: all;
  }

  @media screen and (max-width: 700px) {
    .form-container .input {
      flex: 100%;
    }
  }
</style>
