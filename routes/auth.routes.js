const router = require("express").Router();
const UserModel = require("../models/User.model")
const ClubModel = require("../models/Club.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const getRandomCode = require("../utils/string-generator")
const {sendVerifyEmail, sendRecoverEmail} = require("../utils/emailer")
const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/login", async (req, res, next) => {

  const { email, password } = req.body

  // BE validations
  if (!email || !password ) {
    res.status(400).json({ errorMessage: "Llenar todos los campos" })
    return;
  }

  // validar las credenciales del usuario
  try {
    console.log("Inside try of login service endpoint backend")
    const foundUser = await UserModel.findOne({ email })
    if (!foundUser) {
      res.status(401).json({ errorMessage: "Usuario no registrado" })
      return;
    }

    // validacion de contraseña
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
    if (!isPasswordCorrect) {
      res.status(401).json({ errorMessage: "contraseña invalida" })
      return;
    }

    // Creamos el Token y lo enviamos

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role
    }

    console.log(payload)

    const authToken = jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "6h"
      }
    )

    res.status(200).json( { "authToken":authToken } )

  } catch(err) {
    next(err)
  }

})

router.post("/signup/club", async (req, res, next) => {
  try{
    const {email, password, password2, clubName, clubNIF, role} = req.body

    // Ensure all the fields got data
    if (!email || !password || !password2 || !clubName || !clubNIF){
      res.status(400).json({ errorMessage: "Llenar todos los campos" })
    }

    // Check if pwd1 and pwd2 are the same
    if (password !== password2){
      res.status(400).json({ errorMessage: "Passwords are not the same" })
    }

    // Check if email is already in use
    const foundUser = await UserModel.findOne({email})
    if (foundUser) {
      res.status(400).json({ errorMessage: "User Already Exists" })
      return;
    }

    // Check if NIF is already in use
    const foundNIF = await ClubModel.findOne({clubNIF})
    if (foundNIF) {
      res.status(400).json({ errorMessage: "NIF Already in Use." })
      return;
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const verificationCode = getRandomCode(12)

    // Check if the code generated already exists.
    let foundCode = true
    let generatedCode = ""
    while(foundCode){
      generatedCode = getRandomCode(5, true)
      foundCode = await ClubModel.findOne({generatedCode})
    }

    // Send verification
    // await sendVerifyEmail(email, verificationCode)

    // Adding the user to DataBase
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      verificationCode,
      role
    })
    console.log("verification 8 - DONE - User created on Database")
    console.log(newUser)

    // Adding the Club to DataBase
    await ClubModel.create({
      "name":clubName,
      "owner": newUser._id,
      "nif":clubNIF,
      "code": generatedCode
    })
    console.log("verification 9 - DONE - Club Created on database")

    res.status(200).json()
  }catch(err){
    next(err)
  }
})

router.post("/signup/member", async (req, res, next) => {
  try{
    const {email, password, password2, clubCode} = req.body
    const role = "member"

    console.log(email, password, password2, clubCode, role)
    // Ensure all the fields got data
    if (!email || !password || !password2 || !clubCode){
      res.status(400).json({ errorMessage: "Llenar todos los campos" })
      return
    }
    console.log("All variables are good")
    // Check if pwd1 and pwd2 are the same
    if (password !== password2){
      res.status(400).json({ errorMessage: "Passwords are not the same" })
      return
    }
    console.log("Passwords are the same")
    // Check if email is already in use
    const foundUser = await UserModel.findOne({email})
    if (foundUser) {
      res.status(400).json({ errorMessage: "User Already Exists" })
      return;
    }
    console.log("user doesnt exists")
    // Check if NIF is already in use
    const foundClubCode = await ClubModel.findOne({clubCode})
    if (!foundClubCode) {
      res.status(400).json({ errorMessage: "Code not found, remember, its case sensitive" })
      return;
    }
    console.log("found a club with that code")

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const verificationCode = getRandomCode(12)

    console.log("verification built")
    // Send verification
    // await sendVerifyEmail(email, verificationCode)

    // Adding the user to DataBase
    await UserModel.create({
      email,
      password: hashedPassword,
      onClub: foundClubCode._id,
      verificationCode,
      role
    })
    console.log("user created")
    res.status(200).json()
  }catch(err){
    next(err)
  }
})

router.post("/recover-password", async(req, res, next)=>{
  try{
    const {email} = req.body
    const emailFound = await UserModel.findOne({email})

    if (!emailFound) {
      res.status(400).json({ errorMessage: "User Not Exists" })
      return false;
    }
    const verificationCode = getRandomCode(12)
    await sendRecoverEmail(email, verificationCode)
    await UserModel.findOneAndUpdate(email, {requestedReset:true, verificationCode:verificationCode})
    res.status(200).json({res: true})
  } catch(err){
    next(err)
  }
})

router.post("/recover-code", async (req, res, next)=>{
  try{
    const {code} = req.body
    const codeFound = await UserModel.findOne({verificationCode:code, requestedReset:true})
    if (!codeFound) {
      res.status(400).json({ errorMessage: "Code not Valid" })
      return false;
    }
    await UserModel.findOneAndUpdate({verificationCode:code}, {verificationCode:""})
    res.status(200).json({response: code})
  }catch(err){
    next(err)
  }
})

router.post("/new-password", async(req, res, next)=>{

  try{
    const {email, pwd1, pwd2} = req.body
    console.log(req.body)
    // validate passwords
    if (pwd1 !== pwd2){
      res.status(400).json({ errorMessage: "Passwords are not the same." })
      return false;
    }

    // check if email exists and requested update
    const userFound = await UserModel.findOne({requestedReset: true, email:email})
    if (!userFound){
      res.status(400).json({ errorMessage: "Password already changed" })
      return false;
    }

    // Update the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(pwd1, salt)
    await UserModel.findOneAndUpdate({email:email,  requestedReset: true}, {password:hashedPassword, requestedReset: false})
    console.log("password changed to: ", pwd1)
    res.status(200).json({"response": true})
  }catch(err){
    next(err)
  }
})

router.post("/signup/email-confirm", async (req, res, next)=>{
  try{
    const {code} = req.body
    const findCode = await UserModel.findOne({verificationCode:code})
    if(findCode){
      await UserModel.findOneAndUpdate({verificationCode: code}, {verified:true, verificationCode:""})
      res.status(200).json({res: true})
    }
    res.status(200).json({res: false})

  }catch(err){
    next(err)
  }

})

router.get("/verify-token", isAuthenticated, (req, res, next) => {
  // una ruta para verificar si el usuario tiene un token valido cuando vuelva a la pagina
  res.status(200).json(req.payload)
})

module.exports = router;