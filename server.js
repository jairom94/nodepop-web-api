import 'dotenv/config'

import http from 'node:http';
import app from './app.js';

import { setupWebSocketServer } from './webSocketServer.js'

const server = http.createServer(app);

setupWebSocketServer(server)

server.on('listening',()=>{
    console.log('Server on http:localhost:3000')
});
//localhost abierto a la red domestica
server.listen(3000, '0.0.0.0', () => {
  console.log('Server on http://0.0.0.0:3000');
});