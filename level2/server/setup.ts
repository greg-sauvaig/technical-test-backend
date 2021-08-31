'use strict';
import express from 'express';
import bodyParser from 'body-parser';
import { body } from 'express-validator';
import validateLogFormat from '../../level1/validators/validateLogFormat';
import { sanitizeLogBody } from '../../level1/sanitizers/sanitizeLogBody';
import { errorCatcherGuard } from '../../level1/middlewares/errorCatcherGuard';
import { writeLogRedisController } from '../controllers/writeLogRedisController';
import http from 'http';
import https from 'https';
import { promisify } from 'util';
import { getClient } from './utils';

http.globalAgent.maxSockets = 500;
https.globalAgent.maxSockets = 500;

const server = () => {
  const port: number = 3000;
  const app = express();
  const client = getClient();
  const sendCommand = promisify(client.sendCommand).bind(client);
  app.use(
    '/',
    bodyParser.json(),
    body().custom(body => validateLogFormat(body)),
    errorCatcherGuard,
    body().customSanitizer((body) => sanitizeLogBody(body)),
  );
  app.post(
    '/',
    writeLogRedisController(sendCommand)
  );
  app.listen(
    port,
    () => {
      console.log(`server is listening on ${port}`);
      return;
    }
  );
};
export default server;
