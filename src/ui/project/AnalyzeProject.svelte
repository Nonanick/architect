<script lang="ts">
import IconButton from '../components/form/icon-button/IconButton.svelte';
import { OpenProject } from '../storage/OpenProject';

let analyzer = {};

  </script>

<div class="analyze-project-page page">
  <IconButton icon={{src : '/img/icons/reload.svg'}} on:click={() => {
    architect.Server.post('project/analyze/files', {
      src : $OpenProject.root
    }).then(analyzed => {
      analyzer = analyzed;
    })
  }}></IconButton>
  Project analysis
  <pre>
  {
    JSON.stringify(analyzer, null, 2)
  }
  </pre>
</div>