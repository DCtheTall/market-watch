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
    companies = await Promise.map(companies, async (company) => {
      const data = [];
      return { ...company, data };
    });
    res.status(200).json(companies);
  } catch (err) {
    console.log(err);
    res.status(500).send('Failed to get active companies');
  }
}

module.exports = getActiveCompanies;
