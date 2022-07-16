const express = require('express');
const Post =require('../models/Post');
const User =require('../models/User');
const Comment =require('../models/Comment');
const apiResponder = require('../utils/responseHandler');
const errorHandler =require('../utils/errorHandler');

exports.createEditComment = async(request,response,next)=>{
    try{
        let responseCode;
        if (!request.body.commentid ) {
            if(errorHandler.validate(['cuser','postId','cbody'],request.body)){
                return errorHandler.createError(1003);
            }
        
            const newComment = new Comment({cuser:request.body.cuser,postId:request.body.postId,cbody:request.body.cbody});
            let savedComment= await newComment.save();
            console.log("fetch data"+savedComment);
            let updatepost = await Post.updateOne({_id:request.body.postId},{$set:{comments:savedComment._id}});
            responseCode=4010;
                
       
        } else {
            
            if(errorHandler.validate(['commentid','cbody','cuser'], request.body)){
                return errorHandler.createError(1003);
            }
            let {cuser,commentid,cbody} = request.body;
            console.log(request.user);
            if(cuser===request.user.id){
                let comment = await Comment.findOne({_id: commentid});
                if(comment){
                    let updatedcomment = await Comment.updateOne({_id:commentid},{$set:{cbody: cbody}});
                    responseCode=4012;
                     
                }else{
                    responseCode=2011;
                    
                }
            }else{
                responseCode=2012;
                
            }
        }
        return apiResponder(request, response, next, true, responseCode, {});

    }catch(error){
        next(error);
    }
}


exports.getAllComment=async(request,response,next)=>{
            try{
                let responseCode;
                if(errorHandler.validate(['postid'], request.params)){
                    return errorHandler.createError(1003);
                }
                const comments = await Comment.find({ postId: request.params.postid })
                .populate('cuser', 'first_name last_name ');

                if(!comments){
                    responseCode=2010;
                return apiResponder(request,response,next,true,responseCode,{});
                 }
                 responseCode=4011;
            return apiResponder(request,response,next,true,responseCode,comments);

            }catch(error){
                next(error);
            }
 }

 

exports.deleteComment= async (request, response,next) => {
    try{
        let responseCode;
        if(errorHandler.validate(['commentid','cuser'], request.body)){
            return errorHandler.createError(1003);
        }
        let {commentid,cuser} = request.body;
        console.log(request.user);
        if(cuser===request.user.id){
            let comment = await Comment.findOne({_id: commentid})
            if(comment){
                let deletedComment = await Comment.deleteOne({_id:commentid});
                responseCode=4013; 
            }else{
                responseCode=2013;
            }
        }else{
            responseCode=2014;
            
        }
        return apiResponder(request, response, next, true, responseCode, {});
    }catch(error){
        next(error);
    }

}





