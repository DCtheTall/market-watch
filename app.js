const models = require('./models');
const Promise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes');

global.models = models;
global.Promise = Promise;

const app = express();

app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use(routes);

module.exports = app;
