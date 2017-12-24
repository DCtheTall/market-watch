const config = {
  development: require('./config/webpack/dev'),
  production: require('./config/webpack/prod'),
}

module.exports = config[process.env.NODE_ENV];
