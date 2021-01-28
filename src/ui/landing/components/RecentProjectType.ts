export default interface RecentProject {
  icon? : string;
  title : string;
  description?: string;
  version : string;
  author : string;
  created_at: Date;
  project_root: string;
}