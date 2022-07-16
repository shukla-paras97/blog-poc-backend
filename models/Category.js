const mongoose =require("mongoose");
const Schema =  mongoose.Schema;

//Schema defintion
const CategorySchema = new Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    }
});
module.exports = mongoose.model('Category',CategorySchema);