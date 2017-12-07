const companiesJson = require('../data/companies.json');
const { connectToMongo } = require('../config/mongoose');
const { Company } = require('../models');
const Promise = require('bluebird');

(async () => {
  try {
    await connectToMongo();
    await Promise.each(companiesJson, async (companyData) => {
      const {
        Symbol: symbol,
        Name: name,
      } = companyData;
      const company = new Company({
        name,
        symbol,
        active: false,
      });
      await company.save();
    });
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
})();
