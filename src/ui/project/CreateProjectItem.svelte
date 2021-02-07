<script lang="ts">
  import SvgImage from "../components/SVGImage.svelte";

  export let status: "pending" | "processing" | "done" | "error" = "pending";
  export let title: string = "";
  export let output: string = "";
  let collapsed = true;
</script>

<div class="create-project-item">
  <div class="status-icon">
    <SvgImage src={"/img/icons/status." + status + ".svg"} color="black" />
  </div>
  <div class="title">
    {title}
  </div>
  <div class="collapse-control" />

  <div class="output">
    {output}
  </div>
</div>

<style>
  .create-project-item {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 2px 20px;
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    grid-template-rows: 40px;
    grid-auto-rows: auto;
  }

  .output {
    grid-column: 1 / span 3;
  }
</style>
