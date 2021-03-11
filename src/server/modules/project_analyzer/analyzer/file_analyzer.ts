import glob from 'fast-glob';

export interface FileAnalyzer {
  name: string;
  pattern: string;
  analyze: (filepath: string, fileContents: Buffer) => FileAnalysisWithCategory | Promise<FileAnalysisWithCategory>;
}

export type FileAnalysisWithCategory = FileAnalysis & { _category : string};

export interface FileAnalysis {
  fullpath: string;
  relativePath: string;
  extension: string;
  content: any;
  errors?: string[];
}

export interface FileAnalyzerOutput {
  [categoryName: string]: FileAnalysis[];
}

function isProjectFileAnalyzer(obj: any): obj is FileAnalyzer {
  return (
    typeof obj?.name === "string"
    && typeof obj?.pattern === "string"
    && typeof obj?.analyze === "function"
  );
}

export let FileAnalyzer: Promise<FileAnalyzer[]> = new Promise(
  (resolve, reject) => {
    let analyzers: FileAnalyzer[] = [];
    // Look for .ts files inside the "import.d" folder
    glob("import.d/*.js", {cwd : __dirname})
      .then(analyzerFiles => {
        for (let analyzer of analyzerFiles) {
          import('./' + analyzer).then(module => {
            let analyzer = module.default;
            if (isProjectFileAnalyzer(analyzer)) {
              analyzers.push(analyzer);
              console.log('[ProjectAnalyzer] Loading new file analyzer for ' + analyzer.name);
            } else {
              console.warn('[ProjectAnalyzer] File in analyzer "import.d" directory is not shaped after a FileAnalyzer object!\n-> ' + analyzer)
            }
          });
        }
        resolve(analyzers);
      })
      .catch(err => {
        reject(err);
      });
  });