'use strict';
declare let AllowedBodyKey: keyof AllowedBody;
const Nothing = Symbol('nothing');
type Nothing = typeof Nothing;
type Maybe<T> = T | Nothing;
type AllowedBody = {
  id: string
  service_name: 'web' | 'admin' | 'api'
  process: string
  load_avg_1m: number,
  load_avg_5m: number,
  load_avg_15m: number
};
type Operation<Data = any, Result = any> = {
  data: Data
  resolve: (result: Result) => void
  reject: (error: any) => void
};
declare interface Batcher {
  instance: this
  operations: Operation<any, any>[]
  running: boolean
  runner: (datas: Operation[]) => Promise<void>
  run: (data: any) => Promise<Partial<Operation<any, any>>>
  getInstance: (runner: (datas: Operation[]) => Promise<void>) => this
}
export {
  AllowedBodyKey,
  AllowedBody,
  Maybe,
  Operation,
  Batcher
}
