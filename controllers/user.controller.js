'use strict'

const apiResponder = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');
const User= require('../models/User');
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");

//1 Register User
exports.registerUser=async(request,response,next)=>{
    try{
        let responseCode;
        if(errorHandler.validate(['first_name','last_name','email','password'],request.body)){
            return errorHandler.createError(1003);
        }
        //email already present
        let user = await User.findOne({'email':request.body.email})
        if(user){
            responseCode=2001;
            return apiResponder(request,response,next,true,responseCode,{});
        }
        request.body.password=bcrypt.hashSync(request.body.password,10);
        await User.create(request.body);
        responseCode=4001;
        return apiResponder(request,response,next,true,responseCode,{});
    }catch(error){
        next(error);
    }
}

//2.Login User
exports.loginUser = async(request,response,next)=>{
    try{
        let responseCode;
        if(errorHandler.validate(['email','password'],request.body)){
        return errorHandler.createError(1003);
        }
        let {email,password}=request.body;
        let result =  email.endsWith("@gmail.com") ? true: false;
        if(!result){
            responseCode=2002;
            return apiResponder(request,response,next,true,responseCode,{});
        }
        let user = await User.findOne({email:email})
        if(user){
            let passwordIsValid =await bcrypt.compareSync(password,user.password);
            if(!passwordIsValid){
                responseCode=2002;
                return apiResponder(request,response,next,responseCode,{});
            }
            let token = jwt.sign({
                id:user._id,
                type:user.role
            },process.env.JWT_SECRET_KEY,{expiresIn:'365d'});
            let data={
                auth_token:token,
                id:user._id,
                role:user.role
            }
            responseCode=4002;
            return apiResponder(request,response,next,true,responseCode,data);
        }else{
            responseCode=2002;
            return apiResponder(request,response,next,true,responseCode,{});
        }
       
    }catch(error){
        next(error);
    }
}

//3.edit Profile
exports.editProfile = async(request, response, next) => {
    try{
        let responseCode;
        if(errorHandler.validate([ 'email', "first_name","last_name"], request.body)){
            return errorHandler.createError(1003);
        }
        let { email,first_name,last_name} = request.body;
        console.log(request.user);
        let user = await User.findOne({_id: request.user.id})
        if(user){

            await User.updateOne({_id: request.user.id},{$set:{email: email,first_name:first_name,last_name:last_name}});
            responseCode=4018;
            return apiResponder(request, response, next, true, responseCode, user);
        }
        responseCode=2017;
        return apiResponder(request, response, next, true, responseCode, {});
    }catch(error){
        next(error);
    }
}

//4:Get My Data
exports.getMyData= async(request,response,next)=>{
    try{
        let responseCode;
        let user = await User.findOne({_id: request.user.id})
        
        if(!user){
            responseCode=2003;
            return apiResponder(request,response,next,true,responseCode,{});
        }
        responseCode=4003;
        return apiResponder(request,response,next,true,responseCode,user);

    }catch(error){
        next(error);
    }
}

//5:get blogger Profile
exports.getBloggerProfile = async(request,response,next)=>{
    try{
        let responseCode;
        if(errorHandler.validate([], request.params)){
            return errorHandler.createError(1003);
        }
        const userId = request.params.bloggerId;
        // let {userId} = request.params;
        let userResult = await User.findOne({_id: userId})
        if(!userResult){
            responseCode=2003;
            return apiResponder(request, response, next, true, responseCode, {});
        }
        responseCode=4003;
        return apiResponder(request, response, next, true, responseCode, userResult);

    }catch(error){
        next(error);
    }
}

//6:get all user visitor and blogger
exports.getAllUser= async(request,response,next)=>{
    try{
       let responseCode;
        let user = await User.find({});
        if(!user){
            responseCode=2003;
            return apiResponder(request,response,next,true,responseCode,{});
        }
        responseCode=4003;
        return apiResponder(request,response,next,true,responseCode,user);
    }catch(error){
        next(error);
    }
}


