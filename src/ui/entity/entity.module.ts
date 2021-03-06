import type { IEntity } from '@architect/entity/IEntity';
import EntityLib from '../../lib/entity/entity.lib';

export default {
  GenerateEntityFileContents(entity: Partial<IEntity>) {
    return (
      `import type { IEntity } from '@architect/entity';

const EntityDefinition : IEntity = ${JSON.stringify(entity, null, 2)};

export default EntityDefinition;`
    );
  },
  ...EntityLib
};