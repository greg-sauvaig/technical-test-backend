const sample = require('./logGenerator.js').default;
const _ = require('lodash');
const axios = require('axios');
const uuid = require('uuid');

const ENDPOINT = 'http://localhost:3000';
const requester = axios.create({
  baseURL: 'localhost',
  proxy: false
});
const errors = [];
const httpRequest = async () => {
  try {
    await requester.post(
      ENDPOINT,
      { log: sample(uuid.v4()) },
      { timeout: 500 }
    );
  } catch (error) {
    errors.push(error);
    if (error.code === 'ECONNABORTED') {
      // console.log(`Remote server timed-out on ${ENDPOINT}`, error.timeout);
      return 'timeout';
    } else {
      // console.log(`Connection refused on ${ENDPOINT}`, error.sample);
      return 'error';
    }
  }
};
// setInterval(() => httpRequest(), 1000);
_.times(500, httpRequest);
setTimeout(() => console.log('errors', errors.length), 600);
