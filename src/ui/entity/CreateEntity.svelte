<script lang="ts">
  import type { IArchitectEntity } from "@architect/entity/IArchitectEntity";
  import type { IArchitectEntityProperty } from "@architect/property/IArchitectEntityProperty";
  import CodeHighlight from "../components/CodeHighligter";
  import ColoredButton from "../components/colored-button/ColoredButton.svelte";
  import TextInput from "../components/form/text-input/TextInput.svelte";
  import SvgImage from "../components/SVGImage.svelte";
  import { OpenProject } from "../storage/OpenProject";
  import EntityModule from "./entity.module";
  import TextArea from "../components/form/text-area/TextArea.svelte";
  import IconButton from "../components/form/icon-button/IconButton.svelte";
  import "highlight.js/styles/atom-one-dark.css";

  let entity_name: string;
  let title: string;
  let description: string;
  let fileContentPreview: string;
  let entityDefinition: Partial<IArchitectEntity> = {};

  let keepTitleInSync = true;

  let properties: IArchitectEntityProperty[] = [];

  function syncTitle() {
    if (keepTitleInSync) {
      title = EntityModule.ConvertEntityNameToTitle(entity_name);
    }
  }
  $: {
    entityDefinition.name = entity_name;
    entityDefinition.title = title;
    entityDefinition.description = description;
    fileContentPreview = CodeHighlight.highlight(
      "typescript",
      EntityModule.GenerateEntityFileContents(entityDefinition)
    ).value;
  }
</script>

<style>
  .create-entity-page {
    position: absolute;
    display: grid;
    grid-template-rows: 40px 1fr;
    row-gap: 20px;
  }
  .header {
    display: grid;
    grid-template-columns: 40px auto 1fr;
    line-height: 40px;
  }
  .options {
    direction: rtl;
  }
  .options > :global(*) {
    height: 40px;
    line-height: 40px;
    font-weight: bold;
  }
  .header .icon {
    display: flex;
    align-items: center;
    justify-content: left;
  }
  .header .title {
    font-size: 18pt;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .header .options {
    white-space: nowrap;
  }

  .body {
    position: relative;
    height: calc(100% - 60px);
    width: 100%;
    display: block;
    overflow: hidden;
  }
  form {
    box-sizing: border-box;
    padding: 5px 10px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 4px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.05);
  }
  .select-editor-style {
    width: 100%;
    display: flex;
    align-content: center;
    justify-items: center;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
  }

  .select-editor-style > div {
    height: 30px;
    border-bottom: 3px solid transparent;
    line-height: 30px;
    margin-right: 10px;
  }

  .select-editor-style > div:hover:not(.selected) {
    border-bottom: 3px solid var(--idle-color);
  }

  .select-editor-style > div.selected {
    border-bottom: 3px solid var(--main-color);
  }
  .editor-viewport {
    padding: 5px 0px;
    position: relative;
    top: 0px;
    left: 0px;
    width: 100%;
    height: auto;
  }
  .file-content-preview code {
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 9pt;
    font-family: "JetBrains Mono", monospace;
  }
</style>

<div class="create-entity-page page">
  <sector class="header">
    <div class="icon">
      <SvgImage
        src="/img/icons/sphere.geometry.svg"
        color="black"
        size="32px"
      />
    </div>
    <div class="title">
      new entity: <b>{title ?? entity_name ?? "unnamed"}</b>
    </div>
    <div class="options">
      <ColoredButton
        label="Save"
        icon={{
          src: "/img/icons/save.svg",
          color: "var(--text-on-secondary-color)",
          size: "18px",
        }}
        bgColor="var(--main-color)"
        textColor="white"
      />
      <ColoredButton
        label="Save Draft"
        bgColor="var(--idle-color)"
        textColor="white"
      />
    </div>
  </sector>
  <sector class="body">
    <div class="select-editor-style">
      <div class="form-editor clickable selected" on:click={() => {}}>
        Form Editor
      </div>
      <!-- svelte-ignore missing-declaration -->
      <div
        class="code-editor clickable"
        on:click={() => {
          architect.Editor.Launch($OpenProject.root);
        }}
      >
        Open in Code Editor <SvgImage
          src="/img/icons/forward.svg"
          color="rgba(0,0,0,0.7)"
        />
      </div>
    </div>
    <div class="editor-viewport">
      <form class="entity-form" on:submit|preventDefault={() => {}}>
        <TextInput
          name="name"
          title="Name"
          on:input={() => {
            entity_name = EntityModule.SanitizeEntityName(entity_name);
            syncTitle();
          }}
          bind:value={entity_name}
          required
        >
          Name:
          <slot slot="input-button">
            <IconButton
              label={(keepTitleInSync ? "( ON )" : "( OFF )") +
                " Synchronize title with entity name"}
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
          name="title"
          bind:value={title}
          required
          on:keypress={() => {
            keepTitleInSync = false;
          }}>Title:</TextInput
        >
        <TextArea name="description" bind:value={description}
          >Description:</TextArea
        >
      </form>
      <div class="file-content-preview">
        File preview
        <pre><code class="language-typescript hljs">{@html fileContentPreview}</code></pre>
      </div>
    </div></sector
  >
</div>
