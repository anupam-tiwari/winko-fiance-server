const express = require('express')
const router = express.Router()
const ethers = require('ethers')
const contractAddress = "0x329BEEeD3277d359857b710244719055bA5b0455";
const url = 'https://rpc-mumbai.maticvigil.com/';
const RPCprovider = new ethers.providers.JsonRpcProvider(url);
const winkoTokenAbi = require('../crypto/winkoTokenABI.json');
const { json } = require('body-parser');
const Auth = require('../models/auth')



//get balance 
router.get('/balance/:id', async(req, res) => {
    console.log(req.params.id)
    let balance = await Auth.findById(req.params.id)
    if(balance == null){
        console.log("cannot find account")
    }
    let wallet = new ethers.Wallet(balance.privatekey); 
    let walletSigner = wallet.connect(RPCprovider);
    let tempContract = new ethers.Contract(
         contractAddress,
         winkoTokenAbi,
         walletSigner,
    );
    let balanceBig = await tempContract.balanceOf(wallet.address);
    let balanceNumber = balanceBig.toNumber();
    let decimals = await tempContract.decimals();
    let tokenBalance = balanceNumber / Math.pow(10, decimals);
    console.log(tokenBalance)
    try{
        res.send(JSON.stringify(tokenBalance))
    }catch(err){
        console.log(err)
    }
})


//make trx

router.post('/tx', async(req,res) => {

    let senderAccount = await Auth.findById(req.body.sender); 
    let recieverAccount = await Auth.findById(req.body.reciever); 
    let amount = req.body.amount; 

    console.log(senderAccount); 
    console.log(recieverAccount); 
    console.log(amount); 
    let wallet = new ethers.Wallet(senderAccount.privatekey)
    let walletSigner = wallet.connect(RPCprovider);
    let tempContract = new ethers.Contract(
         contractAddress,
         winkoTokenAbi,
         walletSigner,
    );
    try{
        const tx = await tempContract
        .transfer(recieverAccount.wallet, amount)
        .then((transferResult) => {
          res.send(JSON.stringify(transferResult))
        }); 
    }catch(err){
        console.log(err)
    }

})


module.exports = router