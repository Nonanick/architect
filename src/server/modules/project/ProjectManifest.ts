export interface ProjectManifest {
  name : string;
  
  title? : string;
  description? : string;

  icon? : string;
  
  database: string;
  database_crypt?: string;

  path_alias?: {
    entities?: string | string[];
  };

  author : string;
  created_at: Date;
  version: string;

  last_updated: Date;
  contributors? : string[];
}