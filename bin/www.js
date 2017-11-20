if (!process.env.NODE_ENV) require('dotenv').load();

const http = require('http');
const app = require('../app');
const server = http.createServer(app);
const io = app.io = require('socket.io')(server);
const port = normalizePort(process.env.PORT || 4000);

function normalizePort(val) {
  const port = parseInt(val, 10);
  return isNaN(port) ? val : port >= 0 ? port : false;
}

function onError(err) {
  if (err.syscall !== 'listen') throw err;

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (err.code) {
    case 'EACCESS':
      console.log(`${bind} requires elevated privilege`);
      break;
    case 'EADDRINUSE':
      console.log(`${bind} is already in use`);
      break;
    default:
      throw err;
  }
}

io.on('connection', () => console.log('user connected'));
server.on('listening', () => console.log(`Listening on port ${port}`));
server.on('error', onError);
server.listen(port);
