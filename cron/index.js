const { CronJob } = require('cron');
const models = require('../models');
const Promise = require('bluebird');

async function updateStockData() {
  try {
    const { Company } = models;
    const companies = await Company.find({});
    await Promise.map(
      companies,
      company => company.getStockData().then(() => Promise.delay(5000)),
      { concurrency: 6 }
    );
  } catch (err) {
    console.log(err);
  }
}

const job = new CronJob({
  cronTime: '0 0 0 * * *', // every day
  onTick: updateStockData,
  start: false,
  timeZone: 'America/New_York',
});

if (require.main === module) updateStockData();
else module.exports = job;
