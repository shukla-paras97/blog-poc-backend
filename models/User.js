const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true
    },
    last_name:{
        type:String,
        required:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role:{
      type:String,
      default:"blogger"
    },
    password: {
      type: String,
      required: true,
    },
    joined: {
        type: Date,
        default: Date.now 
    },
    profilePic: {
      type: String,
      default: "",
    },
});

module.exports = mongoose.model("User", UserSchema);
