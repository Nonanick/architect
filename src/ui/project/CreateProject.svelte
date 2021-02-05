<script lang="ts">
  import SvgImage from "../components/SVGImage.svelte";
  import { AppRouter } from "../router/AppRouter";
  import { fade } from "svelte/transition";

  let defaultWorkspace = "";
  
  console.log("Architect Server -> ", Architect.Server);
  $: {
    Architect.Server.get("project/default-workspace").then(w => {
      console.log('Default workspace: ', w);
      defaultWorkspace = w;
      workspace = w;
    }).catch(err => {
      console.error("Failed to fetch default workspace!", err);
    });
  }

  let identifier = "";
  let title = "";
  let description;
  let workspace  = "";

  let keepTitleInSync = true;


  let invalidCharacters = /[^A-z0-9_\-@\.\/]/g;

  function createProject() {
    Architect.Server.post("project/create", {
      identifier,
      workspace,
      title,
      description
    }).then(answer => {
      console.log("Create answer:", answer);
    });
  }

  function syncTitle() {
    if(keepTitleInSync) {
      title = identifier.replace(/[@]/g,'').split(/[_\-A-Z\/]/).map(p => p.charAt(0).toLocaleUpperCase() + p.substr(1)).join(" ");
    }
  }

function verifyIdentifier() {
  if(identifier.match(invalidCharacters)) {
    console.error("Invalid character in identifier!");
    identifier = identifier.replace(invalidCharacters,'');
  }
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
      <div class="navigation-item active">
        <SvgImage
          src="/img/icons/create.project.svg"
          color="var(--secondary-color)"
        />
        Create Project
      </div>
    </div>
  </sector>

  <sector class="body">
    <div class="progress-indicator">
      Form progress
    </div>
    <div class="form-container">
      <div class="first-step form">
        
        <div class="input text" >
          Project identifier <br />
          <input type="text" required name="identifier" on:keyup={async () => {
            identifier = identifier.toLocaleLowerCase();
            verifyIdentifier();
            syncTitle();
          }} bind:value={identifier} />
        </div>
        
        <div class="input text">
          Title: <br />
          <input type="text" name="title" on:keydown={() => keepTitleInSync=false} bind:value={title}/>
        </div>

        <div class="input description">
          Description: <br />
          <textarea placeholder="Project description" bind:value={description} name="description"></textarea>
        </div>
        <div class="input workspace">
          Project root folder
          <input type="text" name="workspace" bind:value={workspace} />
        </div>
      </div>

      <div class="create-project button" on:click={() => createProject()}>
        Create!
      </div>
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
    background-color: rgba(0, 0, 0, 0.02);
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
  .navigation-item.active {
    font-size: 14pt;
    font-weight: 500;
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
    height: 40px;
    padding: 5px 10px;
  }
</style>
