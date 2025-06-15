import http from 'node:http';
import app from './app.js';

const server = http.createServer(app);

server.on('listening',()=>{
    console.log('Server on http:localhost:3000')
});

server.listen(3000);