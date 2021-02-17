<script lang="ts">
  import SvgImage from "../../components/SVGImage.svelte";
  import type { NavigationChildrenProps } from "./NavigationChildrenProps";

  export let info: NavigationChildrenProps;
</script>

<div class="item-child clickable" on:click={() => info.onClick()}>
  <div class="icon">
    <SvgImage src={info.icon} color="var(--main-color)" size="18px" />
  </div>
  <div class="title">
    {info.title}
  </div>
  <div class="options" />
</div>

<style>
  .item-child {
    display: grid;
    grid-template-columns: 30px 1fr 30px;
    grid-template-rows: 30px;
    line-height: 30px;
    border-radius: 3px;
    padding: 3px 0px;
    column-gap: 5px;
  }
  .icon {
    position: relative;
    display: flex;
    align-items: center;
  }
  .title {
    font-size: 10pt;
  }
</style>
