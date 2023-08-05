// defining routes
const router = require('express').Router();
const userRoutes = require('./userRoutes');
const favsongRoutes = require('./favsongsroute');
router.use('/users', userRoutes);
router.use('/favsongs', favsongRoutes);

// exporting routes
module.exports = router;
