import express, { NextFunction } from 'express';
import BatcherLoader from '../utilities/batchLoader';
import { writeFiles } from '../utilities/writeFile';

export function writeLogFilesController () {
  return (request: express.Request, response: express.Response, next: NextFunction | undefined): void => {
    BatcherLoader.getInstance(writeFiles).run(request.body);
    response.status(200).send().end();
  }
}