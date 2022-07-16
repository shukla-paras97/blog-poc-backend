const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suserSchema = new Schema({
    suserId:String,
    susername:String,
    picture:String
})

module.exports =mongoose.model("susers",suserSchema);
