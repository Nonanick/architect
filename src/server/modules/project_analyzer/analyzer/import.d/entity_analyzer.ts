import type { FileAnalyzer } from '../file_analyzer';

const EntityAnalyser : FileAnalyzer = {
  name : 'entity',
  pattern : '*.entity.ts',
  analyze : (filepath, contents) => {
    return {};
  }
}

export default EntityAnalyser;