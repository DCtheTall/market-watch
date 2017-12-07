const { connectToMongo } = require('../config/mongoose');
const { Company } = require('../models');
const Promise = require('bluebird');

(async () => {
  try {
    await connectToMongo();
    const companies = await Company.find({});
    await Promise.each(companies, async (company) => {
      try {
        await company.getStockData();
      } catch (err) {
        console.log('Removing:', company.symbol, 'Error:', err);
        await Company.remove({ symbol: company.symbol });
      }
    });
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
