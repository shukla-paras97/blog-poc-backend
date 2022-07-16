const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    user: {
      type:Schema.Types.ObjectId,
      ref:'User',
      required: true,
    },
    posted:{
        type:Date,
        default:Date.now
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref : 'Category',
      required: false,
    }],
    comments:[{
      type: Schema.Types.ObjectId,
      required: false,
    }]
});

module.exports = mongoose.model("Post", PostSchema);

   