<script lang="ts">
  import type { SvelteComponent } from "svelte/internal";

  export let icon: string = "";
  export let title: string;
  export let description: string = "";
  export let version: string = "";
  export let author: string = "";
</script>

<div class="recent-project">
  <div class="icon">
    <div class="icon-bg">
      {icon.length === 0
        ? title
            .split(" ")
            .map((piece) => piece.charAt(0).toLocaleUpperCase())
            .join("")
        : icon}
      <slot name="icon" />
    </div>
  </div>
  <div class="project-info">
    <div class="title">
      {title}
    </div>
    <div class="description">
      {description}
    </div>
    <div class="version">
      {version}
    </div>
    <div class="author">
      {author}
    </div>
  </div>
</div>

<style>
  .recent-project {
    width: 100%;
    height: 80px;
    padding: 10px 0%;
    position: relative;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 60px 1fr;
    filter: grayscale(1);
    transition: filter 0.4s 0.2s;
    cursor: pointer;
    user-select: none;
  }
  .recent-project:hover {
    filter: grayscale(0.2);
  }

  .icon {
    overflow: visible;
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    line-height: 80px;
    text-align: center;
    font-size: 22pt;
    font-weight: 900;
    color: white;
  }
  .icon-bg {
    width: 80px;
    height: 80px;
    margin: -10px -5px;
    background-color: coral;
    border-radius: 50%;
  }
  .project-info {
    height: 60px;
    box-sizing: border-box;
    background-color: rgb(241, 231, 225);
    display: grid;
    grid-template-columns: 0.7fr 0.3fr;
    grid-template-rows: 30px 20px;
    padding: 5px 20px;
  }

  .title {
    font-weight: 600;
    font-size: 16pt;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    user-select: text;
  }

  .description {
    font-weight: 300;
    font-size: 10pt;
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    user-select: text;
  }

  .version {
    font-weight: 300;
    font-size: 8pt;
    color: rgba(0, 0, 0, 0.7);
    text-align: right;
    user-select: text;
  }

  .author {
    font-weight: 300;
    font-size: 8pt;
    color: rgba(0, 0, 0, 0.9);
    text-align: right;
    user-select: text;
  }
</style>
