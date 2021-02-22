<script lang="ts">
  import SvgImage from "../SVGImage.svelte";
  import type { SVGImageProps } from "../SVGImageProps";

  export let label: string = "";
  export let icon: SVGImageProps | string | undefined;
  export let bgColor: string;
  export let textColor: string;
  export let elevation: number = 0;
  export let fontSize: string = "12pt";
  export let borderRadius: string = "3px";
</script>

<style>
  .colored-button {
    width: auto;
    display: inline-flex;
    flex-direction: row;
    position: relative;
    padding: 0px 20px;
    background-color: var(--bg-color);
    color: var(--text-color);
    font-size: var(--font-size);
    border-radius: var(--border-radius);
  }
  .button-icon {
    margin: 0 8px;
  }
</style>

<div
  class="button colored-button clickable"
  on:click
  on:mouseover
  on:mouseout
  on:contextmenu
  on:dblclick
  on:mousedown
  on:mouseup
  style="
  --bg-color: {bgColor};
  --text-color: {textColor};
  --elevation: {elevation >
  0
    ? elevation
    : 0};
  --font-size: {fontSize};
  --border-radius: {borderRadius};
  "
>

  {#if icon != null}
  <div class="button-icon">
    {#if typeof icon === "string"}
      <img src={icon} alt="button icon for {label}" />
    {:else}
      <SvgImage {...icon} />
    {/if}
  </div>
  {/if}
  <div class="label">{label}</div>
</div>
