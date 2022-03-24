const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)
const authRoutes = require("./auth.routes")
const dashboardRoutes = require("./dashboard.routes")
const membersRoutes = require("./members.routes")
const publicationsRoutes = require("./publications.routes")

router.use("/auth", authRoutes)
router.use("/dashboard", dashboardRoutes)
router.use("/members", membersRoutes)
router.use("/publications", publicationsRoutes)



module.exports = router;
