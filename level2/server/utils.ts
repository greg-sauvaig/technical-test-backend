'use strict';
import redis from 'redis';
import { promisify } from 'util';

export const getClient = () => redis.createClient(
  6379,
  /* 'localhost', */ 'cache',
  {
    host: /* 'localhost', */ 'cache',
    port: 6379,
    retry_strategy: function (options) {
      if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 20) {
        return undefined;
      }
      return Math.min(options.attempt * 100, 3000);
    }
  }
);

export const client = getClient();

export const sendCommand = promisify(client.sendCommand).bind(client);

export default {
  getClient,
  client,
  sendCommand
};
