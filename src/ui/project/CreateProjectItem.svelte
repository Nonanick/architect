<script lang="ts">
  import SvgImage from "../components/SVGImage.svelte";

  type ItemStatus = "pending" | "processing" | "done" | "error";
  export let status: ItemStatus = "pending";
  export let title: string = "";
  export let output: string = "";

  let colors: {
    [a in ItemStatus]: string;
  } = {
    pending: "var(--pending-color)",
    done: "var(--success-color)",
    error: "var(--error-color)",
    processing: "var(--idle-color)",
  };
  let collapsed = true;
</script>

<div class="create-project-item">
  <div class="status-icon">
    <SvgImage
      src={"/img/icons/status." + status + ".svg"}
      color={colors[status]}
    />
  </div>
  <div class="title">
    {title}
  </div>
  <div class="collapse-control" />

  {#if output != ""}
    <div class="output">
      {#each (output ?? "").split("\n") as line}
        <div>{@html line}</div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .create-project-item {
    width: 100%;
    height: auto;
    min-height: auto;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    grid-template-rows: 40px auto;
    grid-auto-rows: auto;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title {
    line-height: 40px;
  }
  .output {
    grid-column: 1 / span 3;
    padding-left: 40px;
    line-height: 25px;
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
