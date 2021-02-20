<script lang="ts">
  import IconButton from "../../../components/form/icon-button/IconButton.svelte";
  import type { IconButtonProps } from "../../../components/form/icon-button/IconButtonProps";
  import SvgImage from "../../../components/SVGImage.svelte";
  import type { NavigationChildrenProps } from "./NavigationChildrenProps";
  import NavigationItemChildren from "./NavigationItemChildren.svelte";
  import { slide } from 'svelte/transition';

  export let iconSource: string = "";
  export let collapsed: boolean = true;
  export let title: string = "";
  export let options: IconButtonProps[] = [];
  export let children: NavigationChildrenProps[] = [];
</script>

<div class="project-navigation-item" on:click|stopPropagation={() => (collapsed = !collapsed)}>
  <div
    class="collapse clickable"
    on:click|stopPropagation={() => (collapsed = !collapsed)}
    style={collapsed === true ? "" : "transform: rotateX(180deg);"}
  >
    <SvgImage
      src="/img/icons/arrow.svg"
      color="var(--secondary-color)"
      size="12px"
    />
  </div>
  <div class="icon">
    <SvgImage src={iconSource} color="var(--secondary-color)" size="20px" />
  </div>
  <div class="title">
    {title}
  </div>
  <div 
    class="options"  
    on:click|stopPropagation 
    >
    {#each options as option}
      <IconButton {...option} />
    {/each}
  </div>
  {#if !collapsed}
    <div class="expanded"  on:click|stopPropagation transition:slide >
      <img
        src="/img/fx/shadow.png"
        class="fx upper-shadow"
        alt="styled shadow for visual effects placed at the top of the collapsable menu"
      />
      {#each children as item}
        <NavigationItemChildren info={item} />
      {/each}
      <img
        src="/img/fx/shadow.png"
        class="fx bottom-shadow"
        alt="styled shadow for visual effects placed at the bottom of the collapsable menu"
      />
    </div>
  {/if}
</div>

<style>
  .project-navigation-item {
    position: relative;
    overflow: hidden;
    top: 0px;
    left: 0px;
    display: grid;
    grid-template-columns: 30px 1fr auto 20px;
     column-gap: 5px;
    grid-template-rows: 40px auto;
    align-items: center;
    cursor: pointer;
  }
  .icon {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    filter: brightness(0);
    transition: filter 0.4s;
  }
  .project-navigation-item:hover .icon {
    filter: brightness(100%);
  }
  .title {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    font-weight: 400;
    font-size: 13pt;
  }
  .options {
    grid-column: 3 / 4;
    grid-row: 1 / 2;
    display: flex;
  }
  .collapse {
    grid-column: 4 / 5;
    grid-row: 1 / 2;
    border-radius: 4px;
    background-color: transparent;
    transition: background-color 0.4s, transform 0.4s;
    text-align: center;
  }
  .collapse:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .expanded {
    grid-column: 1 / 5;
    grid-row: 2 / 3;
    position: relative;
    width: 100%;
    height: auto;
    padding: 5px 0px;
  }
</style>
