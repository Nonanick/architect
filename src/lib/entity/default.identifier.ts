import type { IProperty } from 'clerk';

export const DefaultIdentifier : IProperty = {
  name : '_id',
  type : String,
  unique : true,
  required : true,
  isIdentifier : true
}