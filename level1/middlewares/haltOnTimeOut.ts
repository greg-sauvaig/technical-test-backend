'use strict';
import express, { NextFunction } from 'express';

export function haltOnTimedout (request: express.Request, response: express.Response, next: NextFunction | undefined) {
  if (request.timedout) {
    return response.status(408).send().end();
  }
  next();
}
