import type { PackageManager } from './PackageManager';

export const Yarn : PackageManager = {
  install_dependencies : "yarn",
  update_dependencies : "yarn upgrade",
  install_clerk : "yarn link clerk",
  install_maestro : "yarn link maestro"
};