import type { PackageManager } from './PackageManager';

export const NPM : PackageManager = {
  install_dependencies : "npm i",
  update_dependencies : "npm update",
  install_maestro : "npm link maestro",
  install_clerk : "npm link clerk"
}