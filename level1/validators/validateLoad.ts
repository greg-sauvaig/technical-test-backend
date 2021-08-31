'use strict';
import { ValidationError } from '../errors/validationError';

export function validateLoad (loadValue: any): void {
  if (!loadValue && typeof loadValue !== 'string') {
    // could log but it's slow =), better to just return here
    // console.log('bad loadValue', loadValue)
    throw new ValidationError();
  }
  if (typeof loadValue !== 'string' || 
    parseFloat(`${loadValue}`).toFixed(`${loadValue}`.split('.')[1]?.length || 0) !== loadValue
  ) {
    // console.log('bad loadValue', loadValue)
    // could log but it's slow =), better to just return here
    throw new ValidationError();
  }
  return;
}