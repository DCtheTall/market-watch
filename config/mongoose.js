if (!process.env.NODE_ENV) require('dotenv').load();

const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

const connection = mongoose.createConnection(process.env.MONGO_URI);

function connectToMongo() {
  return new Promise((resolve, reject) => {
    connection.on('open', resolve);
    connection.on('error', reject);
  });
}

connection.on('connecting', () => console.log('Connecting with Mongoose...'));
connection.on('open', () => console.log(`Mongoose connected successfully to ${process.env.MONGO_URI}`));
connection.on('error', err => console.log(`Mongoose connection error: ${err}`));
connection.on('close', () => console.log('Mongoose connection terminated.'));

process.on('exit', () => connection.close());
process.on('SIGINT', () => {
  connection.close();
  process.exit();
});

module.exports = {
  connection,
  connectToMongo,
};
