import { writable, Writable } from 'svelte/store';
import type { ProjectDTO } from '../../lib/project/new_project.interface';
import ModalWindows from './ModalWindows';
import PickAProject from '../project/PickAProject.svelte';
import type { FolderTracker } from '../../app/services/interfaces/file_system/folder_tracker.interface';

export let OpenProjectTracker : FolderTracker | undefined;

export const OpenProject: Writable<undefined | ProjectDTO> = writable<ProjectDTO | undefined>(
  undefined,
  () => {
    let currentlyOpenProject = sessionStorage.getItem('open-project');

    if (currentlyOpenProject != null) {
      try {
        OpenProject.set(JSON.parse(currentlyOpenProject));
      } catch (err) {
        console.error(
          'Failed to load open project from session storage!',
          currentlyOpenProject, 'with error:\n',
          err
        );
      }
    }

  }
);

OpenProject.subscribe(async (newValue) => {
  if (newValue != null) { 
    await initializeTrackerToProject(newValue);
    sessionStorage.setItem('open-project', JSON.stringify(newValue));
  }
});


async function initializeTrackerToProject(project : ProjectDTO) {
  if(OpenProjectTracker != null) {
    await OpenProjectTracker.stop();
  }

  OpenProjectTracker = await window.architect.FileSystem.trackFolder(project.root);

  OpenProjectTracker.on("all",(ev , path) => {
    console.log("Tracker reported event", ev, "on", path);
  });
  
  console.log("New Open project, tracking file changes!");
}


export default {
  ...OpenProject,
  pickAProject: async () => {

    return new Promise((resolve, reject) => {

      let resolved: boolean;

      let modal = ModalWindows.add({
        title: 'Pick a project!',
        icon: {
          src: ''
        },
        windowControls: ['close', 'maximize'],
        draggable: false,
        size: {
          width: '500px',
          height: '350px'
        },
        position: 'center',
        content: PickAProject,
        onClose: () => {
          if (resolved === false || resolve == null) {
            reject("Closed modal window without picking an open project!");
          }
        }
      });

      let unsub = OpenProject.subscribe((newValue) => {
        if (resolved !== false) {
          resolved = true;
          ModalWindows.remove(modal);
          resolve(newValue);
        }
        unsub();
      });
    });
  }
}