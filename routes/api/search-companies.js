const {
  TIME_SERIES_DAILY,
  TIME_SERIES_DAILY_KEY,
} = require('../constants');
const { compareTwoStrings } = require('string-similarity');
const Promise = require('bluebird');
const axios = require('axios');

/**
 * searchCompanies
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
async function searchCompanies(req, res) {
  try {
    const { Company } = models;
    const { q: searchQuery } = req.query;
    const regex = new RegExp(searchQuery.trim(), 'i');
    let companies = await Company.find({
      $or: [{ name: regex }, { symbol: regex }],
      active: false,
    });
    companies = await Promise.filter(companies, async (company) => {
      try {
        let url = 'https://www.alphavantage.co/query?function=';
        url += TIME_SERIES_DAILY;
        url += `&symbol=${company.symbol}`;
        url += `&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
        let { data } = await axios.get(url);
        data = data[TIME_SERIES_DAILY_KEY];
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    });
    companies = companies.map(company => ({
      company,
      searchRelevancy: Math.max(
        compareTwoStrings(company.symbol.toLowerCase(), searchQuery.toLowerCase()),
        compareTwoStrings(company.name.toLowerCase(), searchQuery.toLowerCase())
      ),
    }))
    .sort((a, b) => b.searchRelevancy - a.searchRelevancy)
    .map(({ company }) => company)
    .slice(0, 10);
    res.status(200).json(companies);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Failed to search companies. Query: ${q}`);
  }
}

module.exports = searchCompanies;
