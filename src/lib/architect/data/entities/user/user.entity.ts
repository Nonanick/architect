import type { IEntity } from '@architect/entity';
import SecurePasswordValidation from '../../properties/validations/secure_password.prop_validation';

const EntityDefinition : IEntity = {
  name : 'user',
  title : 'User',
  identifier : {
    name : 'username',
    type : String,
    unique : true,
  },
  properties : {
    password : {
      type : String,
      private : true,
      required : true,
      validate : [SecurePasswordValidation]
    }
  }
}

export default EntityDefinition;