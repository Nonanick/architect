<script lang="ts">
  import IconButton from "../../components/form/IconButton.svelte";
  import type { IconButtonProps } from "../../components/form/IconButtonProps";
  import SvgImage from "../../components/SVGImage.svelte";

  export let iconSource: string = "";
  export let collapsed: boolean = true;
  export let title: string = "";
  export let options: IconButtonProps[] = [];
</script>

<div class="project-navigation-item">
  <div class="collapse" />
  <div class="icon">
    <SvgImage src={iconSource} color="black" />
  </div>
  <div class="title">
    {title}
  </div>
  <div class="options">
    {#each options as option}
      <IconButton {...option} />
    {/each}
  </div>
  {#if !collapsed}
    <div class="expanded" />
  {/if}
</div>
