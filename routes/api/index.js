const { Router } = require('express');
const getActiveCompanies = require('./get-active-companies');
const toggleCompanyActive = require('./toggle-company-active');

const router = Router();
router.get('/companies', getActiveCompanies);
router.put('/company/:id', toggleCompanyActive);

module.exports = router;
