const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    _id:{
        type:String, 
        required: true
    },
    wallet:{
        type:String, 
        required: true, 
        default: "0x0000000"
    }, 
    mnemonic:{
        type: String, 
        required:true,
        default:"mnemonic"
    }, 
    privatekey:{
        type:String, 
        required:true, 
        default:"0x0"
    }

})

module.exports = mongoose.model('users', authSchema)