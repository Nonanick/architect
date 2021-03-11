import type { IPropertyValidation } from '@architect/property/validation/IPropertyValidation';

const ValidationDefinition : IPropertyValidation = {
  name : 'non_empty_string',
  title : 'Property cannot be an empty string',
  validate(value) {
    return String(value).length > 0 ? true : new Error("Property cannot be an empty string");
  }
}

export default ValidationDefinition;