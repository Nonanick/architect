<script lang="ts">
  import type { SelectOptionProps } from "./SelectOptionProps";
  import type { SelectOptionGroup } from "./SelectOptionGroup";

  export let multiple: boolean = false;
  export let value: string | string[];
  export let name: string;
  export let options: SelectOptionProps[] = [];
  export let groupDefinitions: SelectOptionGroup[] = [];
  export let title: string;
  let currentlySelected: SelectOptionProps | undefined;

  let organizedOptions: (Omit<SelectOptionProps,"group"> & {
    group?: SelectOptionGroup;
  })[] = [];

  $: currentlySelected = options.filter((o) => o.value === value)[0];

  $: {
    groupDefinitions.forEach((g) => {
      let allOptionsFromGroup = options.filter((o) => o.group === g.name);

      let optionsWithGroupInfo = allOptionsFromGroup.map((option) => {
        return {
          ...option,
          group: g,
        };
      });
      organizedOptions.push(...optionsWithGroupInfo);
    });
  }

</script>

<style>
  .select-container {
    position: relative;
    overflow: visible;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
  }
  .select-input-label-title {
    display: none;
  }
  select {
    opacity: 0.1;
    width: 100%;
    pointer-events: none;
  }
</style>

<div class="select-container">
  <div class="label-container">
    <slot name="label-icon" />
    <slot>{title}</slot>
  </div>
  <div class="select-input">
    <label class="select-input-label">
      <span class="select-input-label-title">{title}</span>
      <select {multiple} {name} {value}>
        {#each organizedOptions as option}
          <option
            value={option.value}
            selected={currentlySelected?.value === option.value ? true : false}
          >
            {option.label}
          </option>
        {/each}
      </select>
      <div class="select-display">
        <div class="value">
          <div class="currently-selected" />
          <div class="user-input" />
        </div>
        <div class="options">
          <slot name="input-button" />
        </div>
      </div>
      <div class="options-combobox">
        {#each organizedOptions as option}
          Options - {option.value}
        {/each}
      </div>
    </label>
  </div>
</div>
