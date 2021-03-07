<script lang="ts">
  import RadioSlider from "../../components/form/radio-slider/RadioSlider.svelte";
  import type { RadioSliderOptionProps } from "../../components/form/radio-slider/RadioSliderOptionProps";

  let packageManagerOptions: RadioSliderOptionProps[] = [
    {
      value: "yarn",
      label: "Yarn",
      icon: "/img/icons/yarn.logo.svg",
      active_color: {
        bg: "#117cad",
        fg: "white",
      },
    },
    {
      value: "pnpm",
      label: "PNPM",
      icon: "/img/icons/pnpm.logo.svg",
      active_color: {
        bg: "#f69220",
        fg: "white",
      },
    },
    {
      value: "npm",
      label: "NPM",
      icon: "/img/icons/npm.logo.svg",
      active_color: {
        bg: "#C12127",
        fg: "white",
      },
    },
  ];
  export let packageManager: "pnpm" | "npm" | "yarn" = "yarn";
</script>

<RadioSlider
  options={packageManagerOptions}
  bind:value={packageManager}
  showLabels={false}
  name="package_manager"
>
  Package Manager: {packageManagerOptions.filter(
    (o) => o.value === packageManager
  )[0].label}
</RadioSlider>
