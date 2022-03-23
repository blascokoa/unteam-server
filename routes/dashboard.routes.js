const router = require("express").Router();
const UserModel = require("../models/User.model")
const ClubModel = require("../models/Club.model")
const GroupModel = require("../models/Group.model")
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/settings", isAuthenticated, async (req, res, next) => {
  const {email} = req.payload
  const userInfo = await UserModel.findOne({email})
  const clubInfo = await ClubModel.findOne({owner:userInfo})
  const groupsInfo = await GroupModel.find({owner:clubInfo}).sort('name')
  res.status(200).json({userInfo, clubInfo, groupsInfo})
})


router.patch("/settings/main", isAuthenticated, async(req, res, next)=>{
  const {email, fullName, clubName} = req.body
  const {email: emailOriginal} = req.payload
  const userInfo = await UserModel.findOneAndUpdate({email}, { contactDetails: { fullName: fullName }})
  const clubInfo = await ClubModel.findOneAndUpdate({owner:userInfo._id}, {name: clubName})
  console.log(clubInfo)
  res.status(200).json()
})

router.post("/settings/addgroup", isAuthenticated, async(req, res, next)=>{
  const {name, clubId} = req.body
  const response = await GroupModel.create({name:name, owner:clubId})
  res.status(200).json(response)
})

router.delete("/settings/addgroup", isAuthenticated, async(req, res, next)=>{
  const {_id, name, owner} = req.body.data
  const response = await GroupModel.findByIdAndDelete(_id)
  res.status(200).json(response)
})

module.exports = router;