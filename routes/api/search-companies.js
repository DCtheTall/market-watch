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
    const companies = await Company.find({
      $or: [{ name: regex }, { symbol: regex }],
    })
    .sort({ name: 1 });
    res.status(200).json({ companies });
  } catch (err) {
    console.log(err);
    res.status(500).send(`Failed to search companies. Query: ${q}`);
  }
}

module.exports = searchCompanies;
