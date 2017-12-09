const { compareTwoStrings } = require('string-similarity');
const Promise = require('bluebird');

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
      searchable: true,
    });
    companies = companies.map(company => ({
      company,
      searchRelevancy: Math.max(
        compareTwoStrings(company.symbol.toLowerCase(), searchQuery.toLowerCase()),
        compareTwoStrings(company.name.toLowerCase(), searchQuery.toLowerCase())
      ),
    }))
    .sort((a, b) => b.searchRelevancy - a.searchRelevancy)
    .slice(0, 10)
    .map(({ company }) => company);
    res.status(200).json(companies);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Failed to search companies. Query: ${searchQueryq}`);
  }
}

module.exports = searchCompanies;
