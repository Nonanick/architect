import { IPropertyValidation } from '../../../../.architect/typings/property_validation/IPropertyValidation'

const ValidationDefinition = (checkAgainsArray: any[]) => {
  const generated : IPropertyValidation = {
    name : 'in_array',
    title : 'Check if value is inside array',
    validate: (value) => {
      return checkAgainsArray.includes(value) ? true : new Error("Value is not listed inside the valid options");
    }
  }

  return generated;
}

export default ValidationDefinition;