const router = require("express").Router();

const userRoutes = require("./userRoutes");
const favsongRoutes = require("./favsongsroute");

router.use("/users", userRoutes);
router.use("/favsongs", favsongRoutes);

module.exports = router;
