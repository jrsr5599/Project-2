const router = require("express").Router();

const favsongRoutes = require("./favsongsroute.js");

router.use("/song", favsongRoutes);

module.exports = router;
