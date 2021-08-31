'use strict';
import { ValidationError } from '../errors/validationError';

export function validateProcess (process: any): void {
  if (!process || typeof process !== 'string') {
    // could log but it's slow =), better to just return here
    // console.log('bad process', process)
    throw new ValidationError();
  }
  const splittedProcessName = typeof process === 'string' && process.split('.'); // ts is really hard ^^
  if (
    !splittedProcessName[0] || !['web', 'admin', 'api'].includes(splittedProcessName[0]) ||
    !splittedProcessName[1]
  ) {
    // console.log('bad process', process)
    // could log but it's slow =), better to just return here
    throw new ValidationError();
  }
  const maybeNumberInRange = parseInt(splittedProcessName[1], 10);
  if (maybeNumberInRange < 1 || maybeNumberInRange > 4001) {
    // could log but it's slow =), better to just return here
    // console.log('bad process', process)
    throw new ValidationError();
  }
  return;
}