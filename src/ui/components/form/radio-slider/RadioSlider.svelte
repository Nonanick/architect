<script lang="ts">
  import { createEventDispatcher } from "svelte/internal";
  import SvgImage from "../../SVGImage.svelte";
  import type { RadioSliderOptionProps } from "./RadioSliderOptionProps";

  export let name: string;
  export let value: string;
  export let options: RadioSliderOptionProps[];
  export let showLabels: boolean = true;
  export let required: boolean = false;
  export let borderRadius = "50%";

  let currentlySelected: RadioSliderOptionProps | undefined;

  $: currentlySelected = options.filter((o) => o.value === value)[0];

  let dispatch = createEventDispatcher();
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
    grid-auto-columns: 37px;
    column-gap: 0px;
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
    height: 22px;
    top: calc(50% - 11px);
    left: 12px;
    background-color: gray;
    border-radius: 10px;
    background-color: var(--bg-color);
    filter: saturate(40%) brightness(90%);
    transition: filter 0.4s, opacity 0.4s;
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
    border-radius: var(--radius);
    width: 26px;
    height: 26px;
    background-color: var(--bg-color);
    filter: saturate(40%) brightness(90%);
    opacity: 1;
    transition: filter 0.4s, opacity 0.4s;
  }

  .icon-bg-container.selected {
    width: 32px;
    height: 32px;
    box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.1);
    filter: saturate(100%) brightness(100%);
    opacity: 1;
  }
</style>

<div
  class="radioslider-container {$$props.class}"
  style="
  --radius : {borderRadius};
  --bg-color: {typeof currentlySelected?.active_color ===
  'string'
    ? 'var(--secondary-color)'
    : currentlySelected?.active_color.bg ??
      'gray'};
  --fg-color: {typeof currentlySelected?.active_color ===
  'string'
    ? currentlySelected.active_color
    : currentlySelected?.active_color.fg ?? 'var(--main-color)'}"
>
  <div class="label-container">
    <slot name="label-icon" />
    <span class="label">
      <slot />
    </span>
  </div>
  <div class="options-viewport">
    <div class="options-slider-bg" />
    <div class="options-container">
      <!-- svelte-ignore a11y-label-has-associated-control -->

      {#each options as sliderOption}
        <label class="option-item">
          {#if showLabels}
            <span
              class="label-title"
              class:selected={sliderOption.value == value}
            >
              {sliderOption.label}
            </span>
          {/if}
          <input
            type="radio"
            {name}
            group={name}
            value={sliderOption.value}
            on:change={(ev) => {
              value = sliderOption.value;
              if(ev.currentTarget.checked)
                dispatch("change", ev);
            }}
          />

          {#if currentlySelected?.value === sliderOption.value}
            <div class="option-icon-container">
              <div
                class="icon-bg-container selected"
                class:clickable={!required}
                on:click={() => {
                  if (!required) {
                    currentlySelected = null;
                    value = undefined;
                  }
                }}
              >
                <SvgImage
                  src={sliderOption.icon}
                  size="20px"
                  color="var(--fg-color)"
                />
              </div>
            </div>
          {:else}
            <div class="option-icon-container">
              <div class="icon-bg-container clickable">
                <SvgImage
                  src={sliderOption.icon}
                  size="16px"
                  color="var(--fg-color)"
                />
              </div>
            </div>
          {/if}
        </label>
      {/each}
      <slot name="input-button" />
    </div>
  </div>
</div>
