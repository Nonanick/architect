import { writable, Writable } from 'svelte/store';
import type { ProjectDTO } from '../../lib/project/new-project.interface';

const TrackedProjectsStore: Writable<ProjectDTO[]> = writable(
  [],
  (set) => {
    architect.Server
      .get('project/tracked')
      .then(projects => {
        set(projects);
      })
      .catch(_ => {
        console.error('[TrackedProjects] Failed to load inital tracked projects from server!');
      });
  }
);


export const TrackedProjects = {
  subscribe: TrackedProjectsStore.subscribe,
  update : TrackedProjectsStore.update,
  push: (newProject: ProjectDTO) => {
    architect.Server
      .post('project/tracked', newProject)
      .then(_ => {
        TrackedProjectsStore.update(
          projects => {
            projects.push(newProject);
            return projects;
          });
      })
      .catch(err =>
        console.error('[TrackedProjects] Failed to insert new project into the server!', err)
      );
  },
  remove: (projectOrName: string | ProjectDTO) => {
    let projectName: string;

    if (typeof projectOrName === "string") {
      projectName = projectOrName;
    } else {
      projectName = projectOrName.name;
    }
    architect.Server
      .delete('project/tracked/' + encodeURI(projectName))
      .then(_ => {
        TrackedProjectsStore.update(
          projects => projects.filter(p => p.name != projectName)
        );
      })
      .catch(err =>
        console.error(`[TrackedProjects] Failed to remove project with name "${projectName}" into the server!`, err)
      );
  },
  truncate: () => {
    architect.Server
      .delete('project/tracked')
      .then(_ => {
        TrackedProjectsStore.set([])
      })
      .catch(err =>
        console.error('[TrackedProjects] Failed to truncate tracked projects!', err)
      );

  }
}