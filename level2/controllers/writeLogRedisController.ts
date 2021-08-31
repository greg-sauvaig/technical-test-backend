'use strict';
import express from 'express';
import BatcherLoader from '../../level1/utilities/batchLoader';
import { client } from '../server/utils';

function writeRedisList (sendCommand: any) {
  return async (datas: any[]): Promise<void> => {
    const logs = datas.map(data => 
      new Promise(
        async (resolve,) => resolve(JSON.stringify(data.data))
      )
    );
    const processed = await Promise.all(logs);
    const size = await sendCommand('RPUSH',['log', ...processed]);
    const publish = client;
    publish.publish('longProcess', JSON.stringify(processed), () => {console.log('passe', arguments)});
    datas[0].resolve(size);
  }
}

export function writeLogRedisController (sendCommand: any) {
  return (request: express.Request, response: express.Response) => {
    const runner = writeRedisList(sendCommand);
    BatcherLoader.getInstance(runner).run(request.body);
    response.status(202).send().end();
    return;
  }
}