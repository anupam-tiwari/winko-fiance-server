const express = require('express')
const router = express.Router()
const Auth = require('../models/auth')
const ethers = require('ethers')

router.post('/register', async (req,res) => {
    const newWallet = ethers.Wallet.createRandom()
    const newAuth = new Auth({
        _id: req.body.email, 
        wallet: newWallet.address, 
        mnemonic: newWallet.mnemonic.phrase, 
        privatekey: newWallet.privateKey

        // wallet: req.body.address, 
        // mnemonic: req.body.mnemonic.phrase, 
        // privatekey: req.body.privateKey
    }) 
    try{
        const newUser = await newAuth.save()
        res.send(JSON.stringify("user registered"))
    } catch (err){
        res.sendStatus(500).json({message: "user exist"})
    }
})

router.get("/users", async (req, res) => {
    try{
        const users = await Auth.find()
        res.json(users)
    } catch(err) {
        res.sendStatus(500).json( {message: err.message})
    }
})

router.get("/:id", async (req, res) => {
    try{
        const user = await Auth.findById(req.params.id)
        res.json(user)
    }catch(err){
        res.status(500).json( {message: err.message})
    }
})

router.put("/addwallet", async(req, res) => {
    let user = await Auth.findById(req.body.id)
    console.log(user)
    user.wallet = req.body.wallet
    try{
        const updatedAccount = await user.save()
        res.json(updatedAccount)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = router