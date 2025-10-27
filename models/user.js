// getting-started.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true,
    unique:true
  },
  uid:{
    type:String,
    require:true,
    unique:true
  },
  imageUrl:{
    type:String,
    default:null
  },
  role:{
    type:String,
    default:"user"
  },
  create_at:{
    type:Date,
    default:new Date().toISOString()
  },
  last_login:{
    type:Date,
    default:new Date().toISOString()
  }


});

const User = mongoose.model("user",userSchema);
module.exports = User;