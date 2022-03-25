const router = require("express").Router();
const ClubModel = require("../models/Club.Model")
const MemberModel = require("../models/Member.model")
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/getmembers", isAuthenticated, async (req, res, next) => {
  const result = await MemberModel.find({owner: req.payload._id})
  res.status(200).json(result)
})

router.get("/getmemberslcub", isAuthenticated, async (req, res, next) => {
  const result = await ClubModel.findById(req.payload.club).populate("members")

  res.status(200).json(result.members)
})

router.post("/addmember", isAuthenticated, async (req, res, next) => {
  const {name, surname, birthday, year} = req.body
  const response = await MemberModel.create({name, surname, birthday, year, owner:req.payload._id})
  await ClubModel.findByIdAndUpdate(req.payload.club, { $push: { members: response._id } });
  res.status(200).json(response)
})

router.delete("/deletemember", isAuthenticated, async (req, res, next) => {
  const id = req.body.data

  const response = await MemberModel.findByIdAndDelete(id)
  await ClubModel.findByIdAndUpdate(req.payload.club, { $pull: { members: id } });

  res.status(200).json(response)
})



router.get("/verify-token", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload)
})

module.exports = router;