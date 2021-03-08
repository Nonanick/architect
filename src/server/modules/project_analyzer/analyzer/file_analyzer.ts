import EntityAnalyser from './import.d/entity_analyzer';

export interface FileAnalyzer {
  name: string;
  pattern: string;
  analyze? : (filepath : string, fileContents : Buffer) => {

  }
}

export interface FileAnalysis {
  fullpath: '';
  relativePath: '';
  extension: '';
  content: any;
  errors?: string[];
}

export interface FileAnalyzerOutput  {
  [categoryName: string]: FileAnalysis[];
}

export let FileAnalyzer: FileAnalyzer[] = [
  EntityAnalyser,
  /*{
    name: "property",
    pattern: "*.property.ts",
  },
  {
    name: "property_validation",
    pattern: "*.property_validation.ts",
  },
  {
    name: "property_default",
    pattern: "*.property_default.ts"
  },
  {
    name: "property_type",
    pattern: "*.property_type.ts",
  },
  {
    name: "procedure",
    pattern: "*.procedure.ts"
  },
  {
    name: "procedure_proxy",
    pattern: "*.procedure_proxy.ts"
  },
  {
    name: "procedure_hook",
    pattern: "*.procedure_hook.ts"
  },
  {
    name: "controller",
    pattern: "*.controller.ts"
  },
  {
    name: "route",
    pattern: "*.route.ts"
  },
  {
    name: "route_proxy",
    pattern: "*.route_proxy.ts"
  },
  {
    name : "route_hook",
    pattern : "*.route_hook.ts"
  }*/
];