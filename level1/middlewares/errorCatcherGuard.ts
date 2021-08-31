'use strict';
import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';

export function errorCatcherGuard (
  request: express.Request, 
  response: express.Response, 
  next: NextFunction | undefined
) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    console.log('error', JSON.stringify(errors));
    return response.status(400).send().end();
  }
  next();
}
