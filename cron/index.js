if (!process.env.NODE_ENV) require('dotenv').load();

const { CronJob } = require('cron');
const models = require('../models');
const Promise = require('bluebird');
const { sendEmailToMyself } = require('../lib/nodemailer');

async function updateStockData() {
  try {
    const then = Date.now();
    const { Company } = models;
    const today = (new Date()).toISOString().split('T')[0];
    const companies = await Company.find({ lastUpdated: { $lt: new Date(today) } })
                                   .limit(200);
    console.log('Starting sync, this will take a while...');
    await Promise.map(
      companies,
      company => company.getStockData().then(() => Promise.delay(6000)),
      { concurrency: 4 }
    );
    const now = Date.now();
    const dt = (now - then) / 1000;
    console.log(`Sync took ${Math.floor(dt / 60)}m ${Math.floor(dt % 60)}s`);
    if ((new Date()).getHours() > 8 && (new Date()).getHours() < 20) {
      await sendEmailToMyself({
        subject: 'Alpha Vantage Sync',
        text: `Sync took ${Math.floor(dt / 60)}m ${Math.floor(dt % 60)}s`,
      });
    }
    if (require.main === module) process.exit(0);
  } catch (err) {
    console.log(err);
    if (require.main === module) process.exit(1);
  }
}

const job = new CronJob({
  cronTime: '0 * * * *', // every hour every day
  onTick: updateStockData,
  start: false,
  timeZone: 'America/New_York',
});

if (require.main === module) {
  updateStockData().catch(console.log);
}
else module.exports = () => job.start();
