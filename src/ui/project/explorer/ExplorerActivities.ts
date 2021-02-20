import AnalyzeProject from '../AnalyzeProject.svelte';
import CreateEntity from '../../entity/CreateEntity.svelte';
import EditEntity from '../../entity/EditEntity.svelte';

export const ProjectExplorerActivities = {
  'project-analysis' : AnalyzeProject,
  'new-entity' : CreateEntity,
  'edit-entity' : EditEntity,
};

export const DefaultActivity : keyof typeof ProjectExplorerActivities = 'project-analysis';