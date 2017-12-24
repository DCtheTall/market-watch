const companiesJson = require('../data/companies.json');
const { connectToMongo } = require('../config/mongoose');
const { Company } = require('../models');
const Promise = require('bluebird');

(async () => {
  try {
    console.log('Migrating JSON data to Mongo...');
    await connectToMongo();
    await Company.remove({});
    await Promise.each(companiesJson, async (companyData) => {
      const {
        Symbol: symbol,
        Name: name,
      } = companyData;
      const company = new Company({
        name,
        symbol,
        active: false,
        searchable: false,
        lastUpdated: new Date(),
        data: [],
      });
      await company.save();
    });
    console.log(
      'Finished migrating the data to Mongo!',
      '\nGetting companies\' stock data...'
    );
    if (process.argv[2] === '--no-sync') process.exit(0);
    const companies = await Company.find({});
    await Promise.map(
      companies,
      company => company.getStockData().then(() => Promise.delay(6000)),
      { concurrency: 4 }
    );
    console.log('Finished getting stock data!\nBuild successful!');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
