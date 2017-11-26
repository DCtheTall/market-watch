const { compareTwoStrings } = require('string-similarity');

/**
 * searchCompanies
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
async function searchCompanies(req, res) {
  const { Company } = models;
  const { q } = req.query;
  const regex = new RegExp(q.trim(), 'i');
  try {
    let companies = await Company.find({
      $or: [{ name: regex }, { symbol: regex }],
      active: false,
    });
    companies = companies.map(company => ({
      company,
      searchRelevancy: Math.max(
        compareTwoStrings(company.symbol.toLowerCase(), q.toLowerCase()),
        compareTwoStrings(company.name.toLowerCase(), q.toLowerCase())
      ),
    }))
    .sort((a, b) => b.searchRelevancy - a.searchRelevancy)
    .map(({ company }) => company)
    .slice(0, 10);
    res.status(200).json(companies);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Failed to search companies. Query: ${q}`);
  }
}

module.exports = searchCompanies;
