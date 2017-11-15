const { connection } = require('../config/mongoose');
const { linkCompany } = require('./company');

module.exports = {
  Company: linkCompany(connection),
}
