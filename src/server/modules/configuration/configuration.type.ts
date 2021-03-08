export interface Configuration {
  username: string;
  theme: 'dark' | 'light';
  workspace: string;
  package_manager : 'pnpm' | 'yarn' | 'npm';
}