// routes defined here
const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
router.use('/', homeRoutes);
router.use('/api', apiRoutes);

// exporting routes
module.exports = router;
