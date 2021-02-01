<script lang="ts">
  import { AppRouter } from '../router/AppRouter';

</script>

<main >
  <div class="go-back" on:click={() => {
    AppRouter.navigateTo("/");
  }}>
  Homepage
  </div>

  In this page teh developer shall be able to create a new Architect Project
  It shall be built much like any other NodeJS project
  Required to have:

  {`>`} Name
  {`>`} App Icon?
  {`>`} Slogan?
  {`>`} 

</main>
