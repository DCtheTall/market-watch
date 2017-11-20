/**
 * toggleCompanyActive
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
async function toggleCompanyActive(req, res) {
  const { id } = req.params;
  const { Company } = models;
  try {
    let company = await Company.findById(id).exec();
    company.active = !company.active;
    company = await company.save();
    req.app.io.sockets.emit('company-toggled', `${company.name} toggled ${company.active ? 'on' : 'off'} at ${new Date().toISOString()}`));
    res.status(200).json(company);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Failed to toggle active status for company id: ${id}`);
  }
}

module.exports = toggleCompanyActive;
