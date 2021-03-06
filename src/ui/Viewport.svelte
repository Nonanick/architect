<script lang="ts">
import { onMount, SvelteComponent } from "svelte";
  import RouteNotFound from "./notFound/RouteNotFound.svelte";
  import type { AppRouter } from "./router/AppRouter";
  import type { Route, RouteActivation } from "./router/Route";
  import GetAppPages from "./routes/Routes";

  export let router: typeof AppRouter;

  let viewportContainer: HTMLDivElement;
  let currentRoute: Route;
  let visiblePage: typeof SvelteComponent;
  let currentURL: string;
  let urlParams: {
    [key: string]: any;
  } = {};

  let queryParams: {
    [key: string]: any;
  };

  function ApplyRouteTitle(title?: string) {
    document.title = title ?? "Architect";
  }

  function ApplyRouteIcon(icon?: string) {}

  function SwitchCurrentlyVisiblePage(
    newPage: typeof SvelteComponent,
    url: string,
    uParams: any,
    params: any
  ) {
    currentURL = url;
    urlParams = uParams;
    queryParams = params;
    visiblePage = newPage;
  }

  async function DeactivateCurrentRoute() {
    if (currentRoute == null) return true;
    return await (currentRoute.onDeactivation != null
      ? currentRoute.onDeactivation()
      : true);
  }

  onMount(() => {
    GetAppPages().forEach((appPage) => {
      let route: Route = {
        pattern: appPage.pattern,
        guard: appPage.guard,
        onActivation: [
          async (url, urlParams, queryParams) => {
            if (visiblePage != appPage.component) {
              let canDeactivate = await DeactivateCurrentRoute();
              if (canDeactivate !== true) {
                let navigateAnyway = confirm(
                  canDeactivate +
                    "\nAre you sure you wanna quit the current page?"
                );
                if (!navigateAnyway) {
                  router.navigateTo(currentURL);
                  return;
                }
              }
            }

            ApplyRouteTitle(appPage.title);
            ApplyRouteIcon(appPage.icon);

            SwitchCurrentlyVisiblePage(
              appPage.component,
              url,
              urlParams,
              queryParams
            );

            currentRoute = route;
          },
        ],
        onDeactivation: async () => {
          if (appPage.onDeactivation != null) {
            let canDeactivate = await appPage.onDeactivation();
            if (canDeactivate !== true) {
              return canDeactivate;
            }
          }

          return true;
        },
      };

      if (appPage.onActivation != null) {
        (route.onActivation as RouteActivation[]).push(appPage.onActivation);
      }

      router.addRoute(route);
    });

    router.routeNotFound = (urlNotFound) => {
      SwitchCurrentlyVisiblePage(RouteNotFound, urlNotFound, {}, {});
    };

    router.start();
  });
</script>

<div id="app-viewport" bind:this={viewportContainer}>
  <svelte:component
    this={visiblePage}
    {...{
      currentURL,
      urlParams,
      queryParams,
    }}
  />
</div>

<style>
  #app-viewport {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 7px 10px;
    box-sizing: border-box;
  }
</style>
