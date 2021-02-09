export interface NewProject {
  icon? : string;
  name : string;
  
  title? : string;
  description? : string;
  version? : string;
    
  author : string;
  created_at : Date | number;
  
  root : string;
  folder_name : string;
}