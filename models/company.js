const { Schema, ObjectId } = require('mongoose');

const Company = new Schema({
  name: String,
  symbol: String,
  active: Boolean,
});

function linkCompany(connection) {
  return connection.model('company', Company);
}

module.exports = {
  Company,
  linkCompany,
};
