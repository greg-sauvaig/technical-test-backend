'use strict';
import client from './redis';

/**
 * emit logs in the "writeFile" channel
 * @param {Record<string: string[]} datas 
 */
export async function writeFiles(datas: any[]): Promise<void> {
  const logs = datas.map(data => data.data);
  const publisher = client;
  publisher.publish('writefile', JSON.stringify(logs));
}
