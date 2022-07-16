// imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = mongoose.Schema({
    cuser: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    time: {
        type: Date,
        default: Date.now
    },
    cbody: {
        type: String,
        required: true
    }
   
});

module.exports= mongoose.model('Comment',CommentSchema);