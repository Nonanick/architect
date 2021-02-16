<script lang="ts">
  import SvgImage from "../components/SVGImage.svelte";
  import { AppRouter } from "../router/AppRouter";
  import { fade } from "svelte/transition";
</script>

<main class="route-not-found-page  page" transition:fade>
  <sector class="header">
    <div
      class="go-back"
      on:click={() => {
        AppRouter.navigateTo("/");
      }}
    >
      <SvgImage
        src="/img/architect.logo.svg"
        color="var(--secondary-color)"
        size="30px"
      />
    </div>
    <div class="title">
      <div class="inline-align-center">
        <SvgImage
          src="/img/icons/lost.svg"
          color="var(--main-color)"
          size="24pt"
        />
      </div>
      Ermmm - Where did it go?
    </div>
  </sector>

  <sector class="body">
    We could not find the desired route:<br />
    '{AppRouter.currentURL()}' <br />
    <span
      on:click={() => {
        AppRouter.navigateTo("");
      }}
    >
      Back to the homepage
    </span>
    <br />
    <span
      on:click={() => {
        window.history.go(-1);
      }}
    >
      Go back one page
    </span>
  </sector>
</main>

<style>
    .route-not-found-page {
    --header-height: 40px;
    --top-paddding: 5px;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .header {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    display: grid;
    grid-template-columns: 40px auto 1fr 120px;
    column-gap: 20px;
    height: 40px;
    padding: 5px 10px;
  }

  .header .title {
    font-size: 18pt;
    font-weight: bold;
    line-height: 40px;
  }

  .go-back {
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.4s;
  }

  .go-back:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .go-back:active {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .body {
    --body-top: calc(var(--header-height) + (var(--top-paddding) * 2));
    position: absolute;
    top: var(--body-top);
    width: 100%;
    height: calc(100% - var(--body-top));
    padding: 5px 10px;
    width: 100%;
    left: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
</style>
