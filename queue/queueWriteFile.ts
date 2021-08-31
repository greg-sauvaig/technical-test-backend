
import Queue from 'bee-queue';
import fs from 'fs';
import stream from 'stream';
import path from 'path';
import redis from 'redis';

const env = 'cache'; // 'localhost';
export function getJsonStream (data: Object): stream {
  const Stream = new stream.Readable();
  Stream.push(JSON.stringify(data));
  Stream.push(null);
  return Stream;
}

export function writeFile (source: object, destination: string) {
  const input = getJsonStream(source);
  const output = fs.createWriteStream(destination);
  return new Promise((resolve, reject) => {
    output.on('error', error => { console.log(error); reject(error) });
    input.on('error', error => { console.log(error); reject(error) });
    input.on('end', () => resolve(source));
    input.pipe(output);
  });
}

export async function processCB (job: any, done: any) {
  const logs = JSON.parse(job.data);
  for (const log of logs) {
    try {
      await writeFile(log, path.join(`./parsed/${log.id}.json`));
    } catch ( error ) {
      console.log('error parsing log')
    }
  }
  return done(null, job.data);
}

export async function writeFiles(datas: any[]): Promise<void> {
  const logs = datas.map(data => data.data);
  const publisher = redis.createClient(
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
  publisher.publish('writefile', JSON.stringify(logs));
}

const QueuewriteFile = new Queue(
  'writefile',
  {
    redis: {
      host: env
    },
    removeOnSuccess: true,
    removeOnFailure: true
  }
); 
//@ts-ignore
QueuewriteFile.resolve = () => {
  const subscriber = redis.createClient(
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
  subscriber.on('message', async function (channel, message) {
    QueuewriteFile.createJob(message).save()
  });
  subscriber.subscribe('writefile');
  QueuewriteFile.process(10, processCB);
};

export default QueuewriteFile;