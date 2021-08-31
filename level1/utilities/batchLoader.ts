'use strict';
import { Batcher, Operation } from '../types';

const BatcherLoader: Batcher = {
  instance: null,
  operations: [],
  running: false,
  runner: null,
  run: async (data: any, timeProcess: number = 0) => {
    const op: Partial<Operation<any, any>> = { data };
    const promise = new Promise<any>((resolve, reject) => {
      op.resolve = resolve;
      op.reject = reject;
    });
    BatcherLoader.operations.push(op as Operation<any, any>);
    if (!BatcherLoader.running) {
      BatcherLoader.running = true;
      // process.nextTick( async () => {
        setTimeout(async() => {
          const ops = BatcherLoader.operations;
            //console.log('running operation', ops.length)
          BatcherLoader.runner(ops);
          BatcherLoader.running = false;
          BatcherLoader.operations = [];
        }, timeProcess);
      // });
    }
    return promise;
  },
  getInstance: (runner: (data: Operation<any, any>[]) => Promise<void>) => {
    if (BatcherLoader.instance !== null) {
      return BatcherLoader.instance;
    }
    BatcherLoader.runner = runner;
    BatcherLoader.instance = BatcherLoader;
    BatcherLoader.instance.constructor = null;
    return BatcherLoader.instance;
  }
}
export default BatcherLoader;
