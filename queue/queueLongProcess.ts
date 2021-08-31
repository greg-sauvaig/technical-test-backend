import redis from 'redis';
import { promisify } from 'util';
import Queue from 'bee-queue';

const env = 'cache'; // 'localhost';
function sleep (interval: number) {
  const start = new Date().getTime();
  while (true) {
    const now = new Date().getTime();
    if (now - start >= interval) {
      return;
    }
  }
  return;
};

const compute = async (payload: any) => {
  sleep(3000);
  return Object.assign(payload, { slow_computation: "0.0009878" });
};

const getClient = () => redis.createClient(
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
const client = getClient();
const sendCommand = promisify(client.sendCommand).bind(client);

function writeRedisList (sendCommand: any) {
  return async (datas: any): Promise<number> => {
    const errorToLogs: string[] = [];
    const logsProcessedPromise = datas.map((log: string) => 
      new Promise(
        async (resolve, reject) => {
          let json;
          try {
            json = JSON.parse(log);
          } catch (error) {
            console.log('bad json', error);
            errorToLogs.push(log);
            reject(error);
          }
          const res = await compute(json);
          resolve(JSON.stringify(res));
        }
      ) 
    );
    const processed = (await Promise.allSettled(logsProcessedPromise))
    //@ts-ignore
      .filter((response: { status: string, value?: any }) => {
        // if (response.status !== 'fulfilled') {
        //   // console.log(`error writing log ${response.status}`, response);
        // }
        return response.status === 'fulfilled' ;
      })
      .map((reponseFulfilled: { value: string }) => reponseFulfilled.value)
      .map((log: string) => log);

    // const processed = await Promise.all(logs);
    // console.log('process', processed);
    if (!processed?.length || errorToLogs.length) {
      const size = await sendCommand('RPUSH', ['log', ...errorToLogs]);
      console.log('save fail to redis redis', size);
      return 0;
    }
    // console.log('save', logs, logs.length, 'processed logs');
    const size = await sendCommand('RPUSH', ['logProcessed', ...processed]);
    console.log('save success to redis', size);
    return size;
  }
}

const QueueLongProcess = new Queue(
  'longProcessQueue',
  {
    redis: {
      host: env
    },
    removeOnSuccess: true,
    removeOnFailure: true
  }
);

QueueLongProcess.process(
  120, 
  async (job: any, done: any) => {
    const logs = JSON.parse(job.data);
    if (!logs?.length) {
      return;
    }
    const size = await writeRedisList(sendCommand)(logs);
    return done(null, size);
  }
);
//@ts-ignore
QueueLongProcess.resolve = () => {
  const subscriber = getClient();
  subscriber.on('message', function (channel, message) {
    QueueLongProcess.createJob(message).save()
  });
  subscriber.subscribe('longProcess');
};

export default QueueLongProcess;