<script lang="ts">
  import { createEventDispatcher } from "svelte/internal";

  type InputValidationFn = (value: string) => Promise<true | string | string[]>;
  export let name: string;
  export let placeholder: string;
  export let pattern: string;
  export let value: string;

  export let title: string = "";

  export let errors: string[] = [];

  export let validate: InputValidationFn | InputValidationFn[];

  let inputEl: HTMLInputElement;

  let dispatch = createEventDispatcher();

  export async function isValid(): Promise<boolean> {
    return (await getValidationErrors()).length === 0;
  }

  export async function getValidationErrors(): Promise<string[]> {
    if (validate == null) {
      return [];
    }

    if (Array.isArray(validate)) {
      return Promise.all(
        validate.map((v) => {
          return v(inputEl.value);
        })
      ).then((validationResults) => {
        let trueOrError = validationResults.flat();
        let errors = [];
        for (let result of trueOrError) {
          if (result !== true) errors.push(result);
        }
        return errors;
      });
    }

    return validate(inputEl.value).then((r) => {
      return r === true ? [] : typeof r === "string" ? [r] : r;
    });
  }
</script>

<div class="textinput-container {$$props.class}">
  <div class="label-container">
    <slot name="label-icon" />
    <span class="label">
      <slot>
        {title}
      </slot>
    </span>
  </div>
  <div class="input-container {errors.length > 0 ? 'contain-errors' : ''}">
    <slot name="input-icon" />
    <label>
      <span class="label-title">{title}</span>
      <input
        bind:this={inputEl}
        class="input"
        type="text"
        {name}
        {placeholder}
        {pattern}
        bind:value
        on:change={async (ev) => {
          dispatch("change", ev);
          errors = await getValidationErrors();
        }}
        on:keyup={(ev) => {
          dispatch("keyup", ev);
        }}
        on:keydown={(ev) => {
          dispatch("keydown", ev);
        }}
        on:keypress={(ev) => {
          dispatch("keypress", ev);
        }}
        on:input={(ev) => {
          dispatch("input", ev);
        }}
      />
      <slot name="input-button" />
    </label>
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
    height: 40px;
    padding: 0;
  }

  .input-container > label > *:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }

  slot[name="input-icon"] {
    display: block;
    flex-grow: 0;
    height: auto;
  }
  label {
    display: flex;
    flex-grow: 1;
  }
  .input-container input {
    position: relative;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: 0;
    background: 0;
    outline: 0;
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
  .input-container.contain-errors > label > *:not(:last-child) {
    border-right: 1px solid var(--error-color);
  }
</style>
