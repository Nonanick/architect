import type { IPropertyValidation } from '@architect/property/validation/IPropertyValidation';

const ValidationDefinition = (validValuesArray: any[]) => {
  const generated : IPropertyValidation = {
    name : 'in_array',
    title : 'Check if value is inside array',
    validate: (value) => {
      return validValuesArray.includes(value) ? true : new Error("Value is not listed inside the valid options");
    }
  }

  return generated;
}

export default ValidationDefinition;