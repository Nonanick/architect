<script lang="ts">
  import SvgImage from "../SVGImage.svelte";
  import type { SVGImageProps } from "../SVGImageProps";
  import type { IconButtonProps } from "./IconButtonProps";

  export let icon: SVGImageProps;

  export let label: string = "";

  export let showLabel: boolean = true;

  export let onClick: IconButtonProps["onClick"] = () => {};
</script>

<div
  class="icon-button clickable"
  on:click={(ev) => {
    if (onClick != null) onClick(ev);
  }}
  title={label}
>
  <div class="icon-container">
    <SvgImage {...icon} />
  </div>
  {#if label != "" && showLabel}
    <div class="label-container">
      {label}
    </div>
  {/if}
</div>

<style>
  .icon-button {
    cursor: pointer;
    opacity: 0.8;
    padding: 2px 7px;
    box-sizing: border-box;
    background-color: transparent;
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
  }
  .icon-button:hover {
    opacity: 0.85;
    background-color: rgba(0,0,0,0.05);
  }
  .icon-button:active {
    opacity: 1;
    background-color: rgba(0,0,0,0.15);
  }
  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
