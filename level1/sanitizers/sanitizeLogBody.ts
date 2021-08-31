'use strict';
import { AllowedBody, AllowedBodyKey } from '../types';

export function sanitizeLogBody (body: any) {
  const parsedBody = body.log.reduce((acc: AllowedBody, value: any) => {
    const splittedValue = value.split('=');
    const key = splittedValue[0] as any as typeof AllowedBodyKey;
    // @ts-ignore
    acc[key] = splittedValue[1];
    return acc;
  }, {});
  return {
    id: parsedBody.id,
    service_name: parsedBody.service_name,
    process: parsedBody.process,
    load_avg_1m: parsedBody['sample#load_avg_1m'],
    load_avg_5m: parsedBody['sample#load_avg_5m'],
    load_avg_15m: parsedBody['sample#load_avg_15m']
  };
}
