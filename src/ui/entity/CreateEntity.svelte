<script lang="ts">
  import ColoredButton from "../components/colored-button/ColoredButton.svelte";
  import SvgImage from "../components/SVGImage.svelte";

  export let name: string = "";
  export let title: string = "";
</script>

<style>
  .create-entity-page {
    position: absolute;
    display: grid;
    grid-template-rows: 40px 1fr;
  }
  .header {
    display: grid;
    grid-template-columns: 40px auto 1fr;
  }
</style>

<div class="create-entity-page page">
  <sector class="header">
    <div class="icon">
      <SvgImage src="/img/icons/schema.svg" color="black" />
    </div>
    <div class="title">
      new entity: <b>{title ?? name}</b>
    </div>
    <div class="options">
      <div class="save-as-draft clickable button">
        <ColoredButton
          label="Save Draft"
          icon={{
            src: "/img/icons/save.svg",
            color: "var(--text-on-secondary-color)",
          }}
          bgColor="var(--idle-color)"
        />
        <ColoredButton
          label="Save"
          icon={{
            src: "/img/icons/save.svg",
            color: "var(--text-on-secondary-color)",
          }}
          bgColor="var(--main-color)"
        />
      </div>
    </div>
  </sector>
  <sector class="body" />
</div>
