'use strict';
import { validate } from 'uuid';
import { ValidationError } from '../errors/validationError';

export function validateUuidv4 (uuid: any): void {
  if (!uuid || typeof uuid !== 'string' || !validate(uuid)) {
    // could log but it's slow =), better to just return here
    // console.log('bad uuid', uuid);
    throw new ValidationError();
  }
  return;
}
