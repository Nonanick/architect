import HomePage from "../landing/LandingPage.svelte";
import CreateProject from "../project/CreateProject.svelte";
import ProjectExplorer from "../project/explorer/ProjectExplorer.svelte";
import type { SvelteComponent } from "svelte";
import type { GuardRoute } from '../router/Route';

export interface AppPageDefinition {
  title?: string;
  icon?: string;
  pattern: string;
  component: typeof SvelteComponent;
  guard?: GuardRoute | GuardRoute[];
  onActivation?: () => Promise<void>;
  onDeactivation?: () => Promise<true | string>;
}

export default function GetAppPages() {
  const routes: AppPageDefinition[] = [
    {
      title: "Home",
      icon: "",
      pattern: "",
      component: HomePage,
    },
    {
      title: "Architect - New Project",
      icon: "",
      pattern: "new-project",
      component: CreateProject,
      onDeactivation: async () => {
        return true;//"You should really create a new project!";
      }
    },
    {
      title: "Architect - Project",
      icon: "",
      pattern: "project-explorer/:activity?/:target*",
      component: ProjectExplorer,
    }
  ];

  return routes;
}
