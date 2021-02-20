<script lang="ts">
  export let src: string;
  export let color: string = "black";
  export let bgColor: string = "transparent";
  export let radius: string = "0px";
  export let size: string = "22px";
  export let ratio: number = 1;
</script>

<style>
  .icon {
    position: relative;
    display: inline-block;
    width: var(--size);
    height: var(--size);

    background-color: var(--bg-color);
    overflow: hidden;
    vertical-align: middle;
  }
  .fix-ratio {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    padding-top: calc(var(--aspect-ratio) * 100%);
    background-color: var(--icon-color);

    mask-image: var(--source);
    -webkit-mask-image: var(--source);

    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;

    mask-position: center;
    -webkit-mask-position: center;

    mask-size: 100%;
    -webkit-mask-size: 100%;
  }
</style>

<div
  class="icon"
  style="
  --size : {size}; 
  --source: url({src}); 
  --icon-color: {color}; 
  --radius: {radius}; 
  --bg-color : {bgColor}; 
  --aspect-ratio: {ratio}
  "
>
  <div class="fix-ratio" />
</div>
