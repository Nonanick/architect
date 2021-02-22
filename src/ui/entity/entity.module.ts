import type { IArchitectEntity } from '@architect/entity/IArchitectEntity';

export default {
  GenerateEntityFileContents(entity : Partial<IArchitectEntity> ) {
    return (
`import type { IArchitectEntity } from '@architect/entity';

const EntityDefinition : IArchitectEntity = ${JSON.stringify(entity, null, 2)};

export default EntityDefinition;`
    )
  }
}