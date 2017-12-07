const { Schema } = require('mongoose');
const axios = require('axios');
const {
  HIGH_KEY,
  LOW_KEY,
  CLOSE_KEY,
  TIME_SERIES_DAILY,
  TIME_SERIES_DAILY_KEY,
} = require('./constants');

const Company = new Schema({
  name: String,
  symbol: String,
  active: Boolean,
  lastUpdated: Date,
  data: [{
    date: String,
    close: Number,
    high: Number,
    low: Number,
  }],
});

Company.methods.getStockData = async function getStockData() {
  let url = 'https://www.alphavantage.co/query?function=';
  url += TIME_SERIES_DAILY;
  url += `&symbol=${this.symbol}`;
  url += `&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
  let { data } = await axios.get(url);
  data = data[TIME_SERIES_DAILY_KEY];
  let dataKeys = Object.keys(data);
  data = dataKeys.map((date) => {
    const node = data[date];
    return {
      date: (new Date(date)).toISOString(),
      high: +node[HIGH_KEY],
      low: +node[LOW_KEY],
      close: +node[CLOSE_KEY],
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
  this.data = data;
  return await this.save();
}

function linkCompany(connection) {
  return connection.model('company', Company);
}

module.exports = {
  Company,
  linkCompany,
};
