import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { endpointHandler } from './handlers/endpointHandler';

const start = (port: number) => {
    createServer((req, res) => {
    endpointHandler(req, res); 
  }).listen(port, () => console.log(`Listening port: ${port}`))
};

export default start;