<script lang="ts">
  import editor from "@editorjs/editorjs";
  import EditorHeader from '@editorjs/header';
  import EditorList from '@editorjs/list';
  import EditorTable from '@editorjs/table';
  import EditorChecklist from '@editorjs/checklist';
  import EditorMarker from '@editorjs/marker';
  import { onMount } from "svelte";

  export let placeholder: string;
  export let value: string;
  export let title: string = "";
  export let errors: string[] = [];
  export let name: string;
  let editorViewport: HTMLElement;
  let editorInstance: EditorJS.default;

  export let isReadOnly: boolean = false;

  $: {
    if (editorInstance != null) {
      editorInstance.isReady.then((_) => {
        editorInstance.readOnly.toggle(isReadOnly);
      });
    }
  }

  export function readOnly(value: boolean = true) {
    isReadOnly = value;
  }

  onMount(() => {
    editorInstance = new editor({
      holder: editorViewport,
      data: value ? JSON.parse(value) : undefined,
      placeholder,
      readOnly: isReadOnly,
      minHeight : 40,
      logLevel : 'ERROR' as any,
      onChange: () => {
        console.log("Changed!");
        editorInstance.save().then((newValue) => {
          console.log("New value is: ", newValue);
          value = JSON.stringify(newValue);
        });
      },
      tools : {
        EditorHeader,
        EditorList,
        EditorTable,
        EditorChecklist,
        EditorMarker,
      }
    });

    return () => {
      editorInstance.destroy();
    }
  });
</script>

<div class="richtext-container {$$props.class}">
  <div class="label-container">
    <slot name="label-icon" />
    <span class="label">
      <slot>{title}</slot>
    </span>
  </div>
  <div class="input-container {errors.length > 0 ? 'contain-errors' : ''}">
    <div class="richtext-input" bind:this={editorViewport} {name} />
  </div>
  <div class="validation-container">
    {#each errors as err}
      <div class="validation-error">
        {err}
      </div>
    {/each}
  </div>
</div>

<style>
  .label-container {
    display: flex;
    margin-bottom: 3px;
    align-items: center;
  }

  .label-container > :global(*:not(:last-child)) {
    padding-right: 5px;
  }
  .input-container {
    position: relative;
    display: flex;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    height: auto;
    min-height: 40px;
    padding: 0;
  }

  .input-container .richtext-input {
    position: relative;
    width: 100%;
    height: auto;
    border: 0;
    background: 0;
    outline: 0;
    padding: 4px 8px;
    box-sizing: border-box;
  }

  .label-title {
    display: none;
  }

  .validation-container {
    color: var(--error-color);
  }
  .input-container.contain-errors {
    border: 1px solid var(--error-color);
  }
</style>
