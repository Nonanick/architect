<script lang="ts">
  import type { IArchitectEntity } from "@architect/entity/IArchitectEntity";
  import ColoredButton from "../components/colored-button/ColoredButton.svelte";
  import TextInput from "../components/form/text-input/TextInput.svelte";
  import SvgImage from "../components/SVGImage.svelte";
  import { OpenProject } from "../storage/OpenProject";

  let entity_name: string;
  let title: string;

  let entityDefinition: Partial<IArchitectEntity> = {};

  $: {
    entity_name = entityDefinition.name;
    title = entityDefinition.title;
  }
</script>

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
      <div
        class="code-editor clickable"
        on:click={() => {
          architect.Editor.Launch($OpenProject.root);
        }}
      >
        Code Editor
      </div>
    </div>
    <div class="editor-viewport">
      <form class="entity-form" on:submit|preventDefault={() => {}}>
        <TextInput name="name" title="Name" bind:value={entity_name} required>
          Name:
        </TextInput>
      </form>
    </div></sector
  >
</div>

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
    height: 100%;
  }

</style>
