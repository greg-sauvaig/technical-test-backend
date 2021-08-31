import redis from 'redis';
const env = 'cache';// 'localhost';
const client = redis.createClient(
  6379,
  env,
  {
    host: env,
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

export default client;
