<script lang="ts">
  import { createEventDispatcher } from "svelte/internal";
  import SvgImage from "../../SVGImage.svelte";
  import type { RadioSliderOptionProps } from "./RadioSliderOptionProps";

  type InputValidationFn = (value: string) => Promise<true | string | string[]>;

  export let name: string;
  export let value: string;

  export let options: RadioSliderOptionProps[];

  export let errors: string[] = [];

  export let validate: InputValidationFn | InputValidationFn[];

  let currentlySelected: RadioSliderOptionProps | undefined;

  $: currentlySelected = options.filter((o) => o.value === value)[0];

  let inputEl: HTMLTextAreaElement;

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

<style>
  .radioslider-container {
    display: grid;
    grid-template-columns: 1fr auto;
    height: 40px;
    overflow: visible;
  }
  .label-container {
    display: flex;
    margin-bottom: 3px;
    align-items: center;
  }

  .label-container > :global(*:not(:last-child)) {
    padding-right: 5px;
  }
  .options-container {
    position: relative;
    display: grid;
    grid-auto-columns: 40px;
    column-gap: 5px;
    grid-auto-flow: column;

    border-radius: 4px;
    height: auto;
    min-height: 40px;
    padding: 0;
  }

  .option-item {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: visible;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label-title {
    display: none;
  }
  .label-title.selected {
    display: block;
    position: absolute;
    bottom: -25px;
    width: 100%;
    text-align: center;
  }
  .options-viewport {
    position: relative;
    width: auto;
    height: 100%;
  }
  .options-slider-bg {
    position: absolute;
    width: calc(100% - 24px);
    height: 8px;
    top: calc(50% - 4px);
    left: 12px;
    background-color: gray;
    border-radius: 4px;
  }

  input[type="radio"] {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0.01;
  }

  .icon-bg-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    width: 26px;
    height: 26px;
  }

  .icon-bg-container.selected {
    width: 32px;
    height: 32px;
    box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.1);
  }

  .validation-container {
    color: var(--error-color);
  }
  .input-container.contain-errors {
    border: 1px solid var(--error-color);
  }
  .options-container.contain-errors > label > *:not(:last-child) {
    border-right: 1px solid var(--error-color);
  }
</style>

<div class="radioslider-container {$$props.class}" style="--bg-color: ">
  <div class="label-container">
    <slot name="label-icon" />
    <span class="label">
      <slot />
    </span>
  </div>
  <div class="options-viewport">
    <div
      class="options-slider-bg"
      style="background-color: {typeof currentlySelected?.active_color ===
      'string'
        ? 'gray'
        : currentlySelected?.active_color.bg ?? 'black'}"
    />
    <div class="options-container {errors.length > 0 ? 'contain-errors' : ''}">
      <!-- svelte-ignore a11y-label-has-associated-control -->

      {#each options as sliderOption}
        <label class="option-item">
          <span
            class="label-title"
            class:selected={sliderOption.value == value}
          >
            {sliderOption.label}
          </span>
          <input
            type="radio"
            {name}
            group={name}
            value={sliderOption.value}
            on:change={(ev) => {
              value = sliderOption.value;
              dispatch("change", ev);
            }}
          />

          {#if currentlySelected?.value === sliderOption.value}
            <div class="option-icon-container">
              <div
                class="icon-bg-container selected"
                style="background-color: {typeof sliderOption.active_color ===
                'string'
                  ? 'gray'
                  : sliderOption.active_color.bg};"
              >
                <SvgImage
                  src={sliderOption.icon}
                  size="20px"
                  color={typeof sliderOption.active_color === "string"
                    ? sliderOption.active_color
                    : sliderOption.active_color.fg}
                />
              </div>
            </div>
          {:else}
            <div class="option-icon-container">
              <div
                class="icon-bg-container clickable"
                style="background-color: {typeof sliderOption.inactive_color ===
                'string'
                  ? 'lightgray'
                  : sliderOption?.inactive_color?.bg ?? 'lightgray'};"
              >
                <SvgImage
                  src={sliderOption.icon}
                  size="16px"
                  color={typeof sliderOption?.inactive_color === "string"
                    ? sliderOption.inactive_color
                    : sliderOption?.inactive_color?.fg ?? "gray"}
                />
              </div>
            </div>
          {/if}
        </label>
      {/each}
      <slot name="input-button" />
    </div>
  </div>
  <div class="validation-container">
    {#each errors as err}
      <div class="validation-error">
        {err}
      </div>
    {/each}
  </div>
</div>
