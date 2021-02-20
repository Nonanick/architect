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
    flex-direction: column;
    position: relative;
    padding: 0px 10px;
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
    {#if typeof icon === "string"}
      <img src={icon} alt="button icon for {label}" />
    {:else}
      <SvgImage {...icon} />
    {/if}
  {/if}
  <div class="label">{label}</div>
</div>
