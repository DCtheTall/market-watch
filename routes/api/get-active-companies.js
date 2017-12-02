const axios = require('axios');
const {
  INTERVAL_5_MINUTES,
  INTERVAL_15_MINUTES,
  INTERVAL_30_MINUTES,
  INTERVAL_60_MINUTES,
  INTERVAL_DAILY,
  HIGH_KEY,
  LOW_KEY,
  CLOSE_KEY,
  TIME_SERIES_INTRADAY,
  TIME_SERIES_5_MINUTES,
  TIME_SERIES_15_MINUTES,
  TIME_SERIES_30_MINUTES,
  TIME_SERIES_60_MINUTES,
  TIME_SERIES_DAILY,
  TIME_SERIES_DAILY_KEY,
} = require('../constants');

/**
 * getActiveCompanies
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
async function getActiveCompanies(req, res) {
  const { Company } = models;
  try {
    let companies = await Company.find({ active: true })
                                 .sort({ symbol: 1 });
    companies = await Promise.map(companies, async (company) => {
      let url = 'https://www.alphavantage.co/query?function=';
      let key = '';

      switch(req.query.interval) {
        case INTERVAL_DAILY:
          url += TIME_SERIES_DAILY;
          key = TIME_SERIES_DAILY_KEY;
          break;
        case INTERVAL_60_MINUTES:
          url += TIME_SERIES_INTRADAY;
          url += '&interval=';
          url += INTERVAL_60_MINUTES;
          key = TIME_SERIES_60_MINUTES;
          break;
        case INTERVAL_30_MINUTES:
          url += TIME_SERIES_INTRADAY;
          url += '&interval=';
          url += INTERVAL_30_MINUTES;
          key = TIME_SERIES_30_MINUTES;
          break;
        case INTERVAL_15_MINUTES:
          url += TIME_SERIES_INTRADAY;
          url += '&interval=';
          url += INTERVAL_15_MINUTES;
          key = TIME_SERIES_15_MINUTES;
          break;
        case INTERVAL_5_MINUTES:
        default:
          url += TIME_SERIES_INTRADAY;
          url += '&interval=';
          url += INTERVAL_5_MINUTES;
          key = TIME_SERIES_5_MINUTES;
          break;
      }

      url += `&symbol=${company.symbol}`;
      url += `&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

      let { data } = await axios.get(url);
      data = data[key];
      data = Object.keys(data).map((date) => {
        const node = data[date];
        return {
          date: (new Date(date)).toISOString(),
          high: +node[HIGH_KEY],
          low: +node[LOW_KEY],
          close: +node[CLOSE_KEY],
        };
      }).sort((a, b) => new Date(a.date) - new Date(b.date));

      return { ...company._doc, data };
    });
    companies = companies.sort((a, b) => {
      if (a.symbol < b.symbol) return -1;
      if (a.symbol > b.symbol) return 1;
      return 0;
    });
    res.status(200).json(companies);
  } catch (err) {
    console.log(err);
    res.status(500).json('Failed to get active companies');
  }
}

module.exports = getActiveCompanies;
