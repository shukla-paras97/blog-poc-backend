'use strict'
const express= require("express");
const Post = require('../models/Post');
const Category = require('../models/Category');
const apiResponder = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');

exports.addEditCategory=async(request,response,next)=>{
    try{
        let responseCode;
        if (!request.body.categoryid ) {
          
            if(errorHandler.validate(['name'],request.body)){
                return errorHandler.createError(1003);
            }
            
            const newCategory = new Category({name:request.body.name});
            const savedCategory = await newCategory.save();
            responseCode=4004;
            
       
        } else {
            
                if(errorHandler.validate(['categoryid','name'], request.body)){
                    return errorHandler.createError(1003);
                }
                
                let category = await Category.findOne({_id:request.body.categoryid})
                    if(category){
                        let updatedCategory = await Category.updateOne({_id:request.body.categoryid},{$set:{name: request.body.name}});
                        responseCode=4015;
                         
                }else{
                    responseCode=2016;
                    
                }
        }
        return apiResponder(request, response, next, true, responseCode, {});

    }catch(error){
        next(error);
    }
}



exports.getCategories = async(request,response,next)=>{
    try{
        let responseCode;
        const categories =await Category.find({});
        // categories.map((cat)=>{
        //     cat.active=false; 
        //     return {...cat}          
        // })
        responseCode=4005;
        return apiResponder(request,response,next,true,responseCode,categories);
        

    }catch(error){
        next(error);
    }
}

exports.deleteCategory =async(request,response,next)=>{
    try{
        let responseCode;
        if(errorHandler.validate(['categoryid'], request.body)){
            return errorHandler.createError(1003);
        }
        
        
            let category = await Category.findOne({_id: request.body.categoryid})
            
            if(category){
                let deletedcategory = await Category.deleteOne({_id:request.body.categoryid});
                responseCode=4014; 
            }else{
                responseCode=2015;
            }
            return apiResponder(request, response, next, true, responseCode, {});
        
    }catch(error){
        next(error)
    }
}






