const router = require("express").Router();
const PublicationModel = require("../models/Publication.Model")
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");

router.get("/getpublications", isAuthenticated, async (req, res, next) => {
  const response = await PublicationModel.find({clubOwner: req.payload.club})
  res.status(200).json(response)
})

router.post("/addpublication", isAuthenticated, async (req, res, next)=>{
  const {club, _id} = req.payload
  const {title, body} = req.body

  const response = await PublicationModel.create({
    title,
    message:body,
    clubOwner: club,
    owner: _id,
  })

  res.status(200).json(response)
})

router.patch("/editpublication", isAuthenticated, async (req, res, next)=>{
  const {id, body} = req.body
  console.log(id)

  const response = await PublicationModel.findByIdAndUpdate(id,{
    message:body
  })

  res.status(200).json()
})

router.delete("/deletepublication", isAuthenticated, isAdmin, async (req, res, next) =>{
  const {id} = req.body.data
  const response = await PublicationModel.findByIdAndDelete(id)
  res.status(200).json(response)
})

router.delete("/deletemanypublications", isAuthenticated, async(req, res, next)=>{
  const {data} = req.body
  await PublicationModel.deleteMany({_id :{$in: data}})

  res.status(200).json()
})

router.get("/getreaders", isAuthenticated, async(req, res, next)=>{
  const {club, _id} = req.payload
  const response = await PublicationModel.find({clubOwner:club})
  let counter = 0

  response.forEach((eachPublication)=>{
    console.log(eachPublication.title)
    if (eachPublication.readers.includes(_id)){
      console.log(eachPublication.title)
    }else{
      counter += 1
    }
  })

  data = {
    newPub: counter
  }

  res.status(200).json(data)
})

router.post("/addreader", isAuthenticated, async(req, res, next) =>{
  const {id} = req.body
  const {_id} = req.payload
  const pubQuery = await PublicationModel.findById(id)

  if (!pubQuery.readers.includes(_id)){
    await PublicationModel.findByIdAndUpdate(id, { $push: { readers: _id } });
  }

  res.status(200).json()
})

module.exports = router;