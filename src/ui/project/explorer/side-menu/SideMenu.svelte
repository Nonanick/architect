<script lang="ts">
  import SvgImage from "../../../components/SVGImage.svelte";
  import { AppRouter } from "../../../router/AppRouter";
  import { OpenProject } from "../../../storage/OpenProject";

  import NavigationItem from "./NavigationItem.svelte";

  let searchInput: HTMLInputElement;
</script>

<style>
  .title {
    font-size: 22pt;
    font-weight: 400;
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: text-decoration-color 0.4s;
  }
  .title:hover {
    text-decoration-color: var(--main-color);
  }

  .search {
    width: 100%;
    height: 40px;
    line-height: 40px;
    position: relative;
  }
  .search :global(.icon) {
    position: absolute;
    user-select: none;
    top: 11px;
    left: 8px;
    width: 20px;
    height: 20px;
    text-align: center;
    opacity: 0.4;
    transition: opacity 0.4s;
  }
  .search:hover :global(.icon) {
    opacity: 0.7;
  }
  .search input {
    border: 0;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    outline: 0;
    font-size: 10pt;
    width: 100%;
    box-sizing: border-box;
    padding: 4px 10px;
    padding-left: 40px;
  }
  .project-items {
    margin-top: 20px;
    position: relative;
    overflow: hidden;
    height: auto;
    width: 100%;
    padding: 0;
    box-sizing: border-box;
  }
</style>

<nav class="side-menu">
  <div
    class="title"
    on:click={() => {
      AppRouter.navigateTo("project-explorer");
    }}
  >
    {$OpenProject?.title ?? "pick a project!"}
  </div>
  <div
    class="search"
    on:click={() => {
      searchInput.focus();
    }}
  >
    <SvgImage src="/img/icons/search.svg" color="black" size="20px" />
    <input type="text" name="search-in-project" bind:this={searchInput} />
  </div>
  <div class="project-items">
    <NavigationItem
      iconSource="/img/icons/sphere.geometry.svg"
      title="entities"
      collapsed={true}
      children={[
        {
          icon: "/img/icons/add.svg",
          title: "add entity",
          onClick: () => {
            AppRouter.navigateTo("project-explorer/new-entity");
          },
        },
      ]}
    />

    <NavigationItem
      iconSource="/img/icons/database.svg"
      title="archives"
      collapsed={true}
      children={[
        {
          icon: "/img/icons/add.svg",
          title: "add archive",
          onClick: () => {},
        },
      ]}
    />

    <NavigationItem
      iconSource="/img/icons/store.svg"
      title="data stores"
      collapsed={true}
      children={[
        {
          icon: "/img/icons/add.svg",
          title: "add store",
          onClick: () => {},
        },
      ]}
    />

    <NavigationItem
      iconSource="/img/icons/page.svg"
      title="pages"
      collapsed={true}
      children={[
        {
          icon: "/img/icons/add.svg",
          title: "add page",
          onClick: () => {},
        },
      ]}
    />
  </div>
</nav>
