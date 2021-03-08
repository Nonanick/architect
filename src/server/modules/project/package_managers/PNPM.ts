import type { PackageManager } from './PackageManager';

export const PNPM : PackageManager = {
  install_dependencies : "pnpm install",
  update_dependencies : "pnpm upgrade",
  install_clerk : "pnpm link clerk",
  install_maestro : "pnpm link maestro"
};