const express = require('express');
const Post =require('../models/Post');
const User =require('../models/User');
const Category = require('../models/Category');
const Comment = require('../models/Comment');
const apiResponder = require('../utils/responseHandler');
const errorHandler =require('../utils/errorHandler');


exports.addEditPost = async(request,response,next)=>{
    try{
        let responseCode;
        if (!request.body.postid) {
          
            const newPost = new Post({
                title: request.body.title,
                desc: request.body.desc,
                user:request.body.user,
                categories:request.body.categories,
                photo: request.file.path
              });
            let savedPost= await newPost.save();
            
            if (!savedPost) {
                responseCode=4016;
            }else{
                responseCode=4017;
            }
            return apiResponder(request,response,next,true,responseCode,{});            
          
        } else {
            
            if(errorHandler.validate(['postid','user'], request.body)){
                return errorHandler.createError(1003);
            }
            
            console.log(request.user);
            if(request.body.user===request.user.id){
                let post = await Post.findOne({_id:request.body.postid})
                if(post){
                    let updatedpost = await Post.updateOne({_id:request.body.postid},{$set:{title: request.body.title,
                        desc: request.body.desc,
                        categories:request.body.categories,
                        photo: request.file.path}});
                    responseCode=4007; 
                }else{
                    responseCode=2006;
                    
                }
            }else{
                responseCode=2007;
            }
      
        }
        return apiResponder(request, response, next, true, responseCode, {});

    }catch(error){
        next(error);
    }
}


exports.getAllPost = async(request,response,next)=>{
    try{
        let responseCode;
        let post = await Post.find({})
        .populate('user', 'first_name last_name')
        .populate('comments','cuser cbody')
        .populate('categories', 'name')
        ;
       

        console.log("fetch post:"+post);
        
        if(!post){
            responseCode=2006;
            return apiResponder(request,response,next,true,responseCode,{});
        }
        responseCode=4008;
        return apiResponder(request,response,next,true,responseCode,post);
    }catch(error){
        next(error);
    }

}

exports.getPostByCategory= async(request,response,next)=>{
    try{
        let responseCode;
        if(errorHandler.validate(['categoryid'], request.params)){
            return errorHandler.createError(1003);
        }
        let {categoryid} = request.params;
        let post = await Post.find({categories: {
            $in: [categoryid],
          }})
        .populate('user', 'first_name last_name')
        .populate('categories', 'name');
        
        if(!post){
            responseCode=2004;
            return apiResponder(request,response,next,true,responseCode,{});
        }
        responseCode=4008;
        return apiResponder(request,response,next,true,responseCode,post);
    }catch(error){
        next(error);
    }
  
}







exports.deletePost= async (request, response,next) => {
    try{
        let responseCode;
        if(errorHandler.validate(['id','user'], request.body)){
            return errorHandler.createError(1003);
        }
        let {id,user} = request.body;
        console.log(request.user);
        if(user===request.user.id){
            let post = await Post.findOne({_id: id})
            if(post){
                let deletedpost = await Post.deleteOne({_id:id});
                responseCode=4009; 
            }else{
                responseCode=2008;
            }
        }else{
            responseCode=2009;
        }
        return apiResponder(request, response, next, true, responseCode, {});
    }catch(error){
        next(error);
    }

}

