<script lang="ts">
  import TextInput from "../../components/form/text-input/TextInput.svelte";
  import { ProjectModule } from "../project.module";
  import SvgImage from "../../components/SVGImage.svelte";
  import IconButton from "../../components/form/icon-button/IconButton.svelte";
  import TextArea from "../../components/form/text-area/TextArea.svelte";

  export let packageName: string;
  export let title: string;
  export let description: string;
  export let author: string;
  export let version: string;

  export let workspace: string;

  let keepTitleInSync = true;

  function syncTitle() {
    if (keepTitleInSync) {
      title = ProjectModule.convertPackageNameToTitle(packageName);
    }
  }

  function verifyIdentifier() {
    packageName = ProjectModule.sanitizePackageName(packageName);
  }
</script>

<style>
  .col-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;
  }

  @media screen and (max-width: 800px) {
    .col-2 {
      grid-template-columns: 1fr;
    }
  }
</style>

<div class="col-2">
  <TextInput
    class="input"
    name="identifier"
    required
    bind:value={packageName}
    on:keyup={() => {
      packageName = packageName.toLocaleLowerCase();
      verifyIdentifier();
      syncTitle();
    }}
  >
    Package Name:
    <div slot="label-icon">
      <SvgImage src="/img/icons/medal.svg" size="20px" />
    </div>
    <slot slot="input-button">
      <IconButton
        label={(keepTitleInSync ? "( ON )" : "( OFF )") +
          " Synchronize title with package name"}
        icon={{
          src: "/img/icons/sync.svg",
          color: keepTitleInSync ? "green" : "var(--error-color)",
        }}
        showLabel={false}
        on:click={() => {
          if (keepTitleInSync) {
            keepTitleInSync = false;
          } else {
            keepTitleInSync = true;
            syncTitle();
          }
        }}
      />
    </slot>
  </TextInput>

  <TextInput
    class="input"
    name="title"
    bind:value={title}
    on:input={() => {
      keepTitleInSync = false;
    }}
  >
    Title:
  </TextInput>
</div>
<div class="col-2">
  <TextInput class="input" name="author" bind:value={author}>Author:</TextInput>

  <TextInput class="input" name="version" bind:value={version}>
    Version:
  </TextInput>
</div>

<TextArea bind:value={description} name="description">Description:</TextArea>

<TextInput
  class="input"
  name="workspace"
  bind:value={workspace}
  validate={async (value) => {
    return value.length > 0 ? true : "Cannot be empty!";
  }}
>
  Location:
  <div slot="label-icon">
    <SvgImage src="/img/icons/folder.location.svg" size="25px" />
  </div>
  <slot slot="input-button">
    <IconButton
      label="Pick Location"
      icon={{ src: "/img/icons/pick.folder.svg" }}
      showLabel={false}
      on:click={() => {
        window.architect.FileSystem.pickFolder()
          .then((newLocation) => {
            workspace = String(newLocation);
          })
          .catch((failed) => {
            console.error("Failed to open directory", failed);
          });
      }}
    />
  </slot>
</TextInput>
