<script lang="ts">
import SvgImage from "../../SVGImage.svelte";


  export let expanded : boolean = false;

  export let contractedFields : string[] = [];

</script>

  <div class="item-form">
    <div class="control-expansion"><SvgImage src="/img/icons/arrow.svg" color="black" size="15px" /></div>
    {#if expanded}
      Show form
    {:else}
      One liner!
    {/if}
  </div>

  <style>

  </style>