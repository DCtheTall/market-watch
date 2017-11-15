/**
 * toggleCompanyActive
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
async function toggleCompanyActive(req, res) {
  try {
    const { Company } = models;
    const { id } = req.params;
    let company = await Company.findById(id).exec();
    company.active = !company.active;
    company = await company.save();
    res.status(200).json({ company });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
}

module.exports = toggleCompanyActive;
