import { writable, Writable } from 'svelte/store';
import type { ProjectDTO } from '../../lib/project/new-project.interface';

export const OpenProject : Writable<undefined|ProjectDTO> = writable<ProjectDTO|undefined>(undefined);