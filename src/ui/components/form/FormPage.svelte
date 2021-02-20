<script lang="ts">
  import SvgImage from "../SVGImage.svelte";
  import type { SVGImageProps } from "../SVGImageProps";

  export let title: string = "";
  export let icon: SVGImageProps;
</script>

<div class="form-page page">
  <div class="header">
    <div
      class="go-back"
      on:click={() => {
        // TODO check if form is not in an 'unsaved state'
        window.history.back();
      }}
    >
      <SvgImage
        src="/img/icon/back.svg"
        color="var(--text-on-secondary-color)"
      />
    </div>
    {#if icon != null}
      <div class="icon" />
    {/if}
    <div class="title">
      {title}
    </div>
    <div class="options" />
  </div>
  <div class="body" />
</div>
