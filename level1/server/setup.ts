'use strict';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import timeout from 'connect-timeout';
import validateLogFormat from '../validators/validateLogFormat';
import { sanitizeLogBody } from '../sanitizers/sanitizeLogBody';
import { haltOnTimedout } from '../middlewares/haltOnTimeOut';
import { errorCatcherGuard } from '../middlewares/errorCatcherGuard';
import { writeLogFilesController } from '../controllers/writeLogFilesController';

const server = () => {
  const port: number = 3000;
  const app = express();
  app.use(
    '/',
    // timeout('500ms'),
    // cors(),
    // compression(),
    // helmet(),
    // rateLimit({
    //   windowMs: 60 * 1000, // 1 minute
    //   max: 5000,
    //   message: 'too many request limit is 5000 per minute'
    // }),
    bodyParser.json(),
    // haltOnTimedout,
    body().custom(body => validateLogFormat(body)),
    // haltOnTimedout,
    errorCatcherGuard,
    body().customSanitizer((body) => sanitizeLogBody(body)),
    // haltOnTimedout
  );
  app.post(
    '/',
    writeLogFilesController()
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
