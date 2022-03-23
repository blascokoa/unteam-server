const router = require("express").Router();
const UserModel = require("../models/User.model")
const ClubModel = require("../models/Club.model")
const GroupModel = require("../models/Group.model")
const MemberModel = require("../models/Member.model")
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/getmembers", isAuthenticated, async (req, res, next) => {
  const result = await MemberModel.find({owner: req.payload._id})
  res.status(200).json(result)
})

router.post("/addmember", isAuthenticated, async (req, res, next) => {
  const {name, surname, birthday, year} = req.body
  const response = await MemberModel.create({name, surname, birthday, year, owner:req.payload._id})

  res.status(200).json(response)
})



router.get("/verify-token", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload)
})

module.exports = router;