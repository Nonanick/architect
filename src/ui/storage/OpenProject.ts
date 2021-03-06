import { writable, Writable } from 'svelte/store';
import type { ProjectDTO } from '../../lib/project/new_project.interface';
import ModalWindows from './ModalWindows';
import PickAProject from '../project/PickAProject.svelte';

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

OpenProject.subscribe((newValue) => {
  if (newValue != null)
    sessionStorage.setItem('open-project', JSON.stringify(newValue));
});


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