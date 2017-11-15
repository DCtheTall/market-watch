/**
 * getActiveCompanies
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
async function getActiveCompanies(req, res) {
  try {
    const { Company } = models;
    const companies = await Company.find({ active: true }).exec();
    res.status(200).json({ companies });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
}

module.exports = getActiveCompanies;
