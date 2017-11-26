const axios = require('axios');
const {
  INTERVAL_1_MINUTE,
  TIME_SERIES_INTRADAY,
  TIME_SERIES_1_MINUTE,
  TIME_SERIES_DAILY,
  TIME_SERIES_WEEKLY,
  TIME_SERIES_MONTHLY,
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

      switch(req.query.inverval) {
        case INTERVAL_1_MINUTE:
        default:
          url += TIME_SERIES_INTRADAY;
          url += '&interval=';
          url += INTERVAL_1_MINUTE;
          key = TIME_SERIES_1_MINUTE;
      }

      url += `&symbol=${company.symbol}`;
      url += `&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

      let { data } = await axios.get(url);
      data = data[key];
      data = Object.keys(data).map((date) => {
        const node = data[date];
        return { ...node, date: new Date(date) };
      }).sort((a, b) => new Date(a.date) - new Date(b.date));

      return { ...company._doc, data };
    });
    res.status(200).json(companies);
  } catch (err) {
    console.log(err);
    res.status(500).send('Failed to get active companies');
  }
}

module.exports = getActiveCompanies;
