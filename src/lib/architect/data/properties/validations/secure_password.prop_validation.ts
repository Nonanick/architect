import type { IPropertyValidation } from '@architect/property/validation/IPropertyValidation';

const ValidationDefinition : IPropertyValidation = {
  name : 'secure_password',
  title : 'Secure Password',
  validate(value : string) {
    return value.length > 8 ? true : new Error("Password is too short!")
  }
}

export default ValidationDefinition;