'use strict';
import { ValidationError } from '../errors/validationError';
import { AllowedBodyKey } from '../types';
import { validateLoad } from './validateLoad';
import { validateProcess } from './validateProcess';
import { validateUuidv4 } from './validateUuidv4';

 const validateLogFormat = (body: any) => {
  if (!body?.log || typeof body?.log !== 'object' || Object.keys(body).length !== 1) {
    // could log but it's slow =), better to just return here
    // console.log('bad body', body)
    throw new ValidationError();
  }
  const allowed = [
    'id',
    'service_name',
    'process',
    'sample#load_avg_1m',
    'sample#load_avg_5m',
    'sample#load_avg_15m'
  ];
  const payload: {
    id?: string
    service_name?: 'web' | 'admin' | 'api'
    process?: string
    'sample#load_avg_1m'?: number
    'sample#load_avg_5m'?: number
    'sample#load_avg_15m'?: number
    load_avg_1m?: number,
    load_avg_5m?: number,
    load_avg_15m?: number
  } = {};
  for (const [index, entrie] of Object.entries(body.log)) {
    const splittedValue = (entrie as string).split('=');
    const key = `${splittedValue[0]}` as any as typeof AllowedBodyKey;
    // @ts-ignore
    if (!allowed.includes(`${key}`) || payload[`${key}`]) {
      // console.log('bad body', body)
      throw new ValidationError();
    }
    // @ts-ignore
    payload[`${key}`] = splittedValue[1];
  }
  validateUuidv4(payload.id);
  validateProcess(payload.process);
  validateLoad(payload['sample#load_avg_1m']);
  payload.load_avg_1m = payload['sample#load_avg_1m'];
  delete payload['sample#load_avg_1m'];
  // console.log('load_avg_1m', payload.load_avg_1m);
  validateLoad(payload['sample#load_avg_5m']);
  payload.load_avg_5m = payload['sample#load_avg_5m'];
  delete payload['sample#load_avg_5m'];
  // console.log('load_avg_5m', payload.load_avg_5m);
  validateLoad(payload['sample#load_avg_15m']);
  payload.load_avg_15m = payload['sample#load_avg_15m'];
  delete payload['sample#load_avg_15m'];
  return payload;
};

export default validateLogFormat;