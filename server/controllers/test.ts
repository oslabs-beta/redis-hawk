import { createClient } from 'redis';
import { promisify } from 'util';

const client = createClient({host: '127.0.0.1', port: 6379});
// promisify(client.type).bind(client);
const get = promisify(client.get).bind(client);

const tester = async () => {
  const res = await get('key');
  console.log(res);
  return res;
}

// console.log(tester().then(res => console.log('asdf', res)));

// get('key').then(res => console.log('got from promise', res));

tester();