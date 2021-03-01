<script lang="ts">
  import IconButton from "../form/icon-button/IconButton.svelte";
  import type { ListFieldMetadata } from "./ListFieldMetadata";
  import type { ListOrderingFunction } from "./ListOrderingFunction";

  export let fieldMetadata: {
    [name: string]: ListFieldMetadata;
  } = {};

  export let rows: {}[] = [];
  export let rowOptions: {}[] = [];

  export let queryString: string;
  export let queryableFields: string[];

  let visibleRows: {}[] = [];
  let orderedFields: ListFieldMetadata[] = [];

  $: {
    
    // Row sorting
    visibleRows = rows.sort(ordering);

    // Order sorting
    orderedFields = Object.values(fieldMetadata).sort((a, b) =>
      a.position > b.position ? 1 : -1
    );

    // Row filtering
    if (queryString != null) {
      visibleRows = rows.filter((row) => {
        let searchInFields: string[];
        if (queryableFields != null) {
          searchInFields = queryableFields;
        } else {
          searchInFields = Object.keys(row);
        }
        for (let field of searchInFields) {
          if (String(row[field]).includes(queryString)) {
            return true;
          }
        }

        return false;
      });
    }
  }

  export let ordering: ListOrderingFunction = (rowA, rowB) => {
    for (let tryField of ["title", "name", "label", "description"]) {
      if (rowA[tryField] != undefined) {
        return rowA[tryField] > rowB[tryField]
          ? 1
          : rowA[tryField] < rowB[tryField]
          ? -1
          : 0;
      }
    }
    return 0;
  };
</script>

<div class="embedded-list">
  <div class="list-options-header" />
  <div class="list-table">
    <div class="table-header">
      {#each orderedFields as field}
        <div
          class="header-field column header-column"
          name={field.name}
          style="--column-size: {field.relative_size}fr"
        >
          <div class="column-text">
            {field.title}
          </div>
          <div class="column-options">
            <IconButton
              icon={{ src: "/img/icons/sort.svg" }}
              label="Order By {field.name}"
              on:click={() => {
                console.log("order by", field.name, "asc");
              }}
            />
            <IconButton
              icon={{ src: "/img/icons/adjust.width.svg" }}
              label="auto adjust width"
              on:click={() => {
                console.log("order by", field.name, "asc");
              }}
            />
          </div>
        </div>
      {/each}
    </div>
    <div class="table-body">
      {#each visibleRows as row}
        Row!
        {#each orderedFields as field}
          <div
            class="row-field column row-column"
            name={field.name}
            title={row[field.name]}
            style="--column-size: {field.relative_size}fr"
          >
            {field.name} : {row[field.name]}
          </div>
        {/each}
        <div
          class="row-field column row-column options-column"
          style="--column-size: calc(40px * {rowOptions.length});"
          name="row-options"
        >
          {#each rowOptions as option}
            ROpt
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>
