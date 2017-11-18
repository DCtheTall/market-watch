const { Router } = require('express');
const getActiveCompanies = require('./get-active-companies');
const toggleCompanyActive = require('./toggle-company-active');
const searchCompanies = require('./search-companies');

const router = Router();
router.get('/companies/active', getActiveCompanies);
router.get('/companies/search', searchCompanies);
router.put('/company/:id/active', toggleCompanyActive);

module.exports = router;
