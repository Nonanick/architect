export interface ProjectInterface {
  icon? : string;
  name : string;
  
  title? : string;
  description? : string;
  version? : string;
    
  author : string;
  created_at : Date | number;
  
  root : string;
  metadata_root? : string;
}