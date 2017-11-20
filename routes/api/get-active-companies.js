const axios = require('axios');

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
    // TODO get stock data based on query parameters passed to this route
    res.status(200).json(companies);
  } catch (err) {
    console.log(err);
    res.status(500).send('Failed to get active companies');
  }
}

module.exports = getActiveCompanies;
