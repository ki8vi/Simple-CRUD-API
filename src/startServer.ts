import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { CONSTANTS } from './constants/constants';
import { Methods } from './types/methods';

export const start = (port: number) => {
  const server = createServer((req, res) => {
    console.log(req.url === CONSTANTS.USERS_ENDPOINT)
    if(req.method === Methods.GET && req.url === CONSTANTS.USERS_ENDPOINT) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([]))
    }
  });
  server.listen(port, () => console.log(`Listening port: ${port}`))
};


