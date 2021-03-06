import { IPropertyValidation } from '../../../../.architect/typings/property_validation/IPropertyValidation';

let validHtmlColors : string[] = [];

let hexColorPattern = /^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/;

let hslColorPattern = /hsl\(\)/;
let hslaColorPattern = /hsl\(\)/;

let rgbColorPattern = /hsl\(\)/;
let rgbaColorPattern = /hsl\(\)/;


const PropertyValidation : IPropertyValidation = {
  name : 'is_color',
  title : 'Is valid color',
  validate(value) {
    return (
      String(value).replace(/ /g,'').match(hexColorPattern)
      || validHtmlColors.includes(String(value).toLocaleLowerCase())
      || String(value).replace(/ /g,'').match(hslColorPattern) 
      || String(value).replace(/ /g,'').match(hslaColorPattern) 
      || String(value).replace(/ /g,'').match(rgbColorPattern) 
      || String(value).replace(/ /g,'').match(rgbaColorPattern) 
      ) ? true : new Error("Value is not a valid color!")
  }
}

export default PropertyValidation;