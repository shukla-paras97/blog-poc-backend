const passport = require("passport");
const GooleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose')
const User= require('../models/Suser');

// const User = mongoose.model('susers')


passport.serializeUser((user,done)=>{
    done(null,user.id)
})


passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user)
    })
})

passport.use(
    new GooleStrategy({
        clientID:process.env.googleClientID,
        clientSecret:process.env.googleClientSecret,
        callbackURL:"/auth/google/callback",
    },
    async(accessToken, refreshToken, profile,done)=>{
    //    console.log("profile",profile);
    //    User.findOne({userId:profile.id})
    //  .then((existingUser)=>{
    //       if(existingUser){
    //           done(null,existingUser)
    //       }else{
    //            new User({
    //                suserId:profile.id,
    //                susername:profile.displayName,
    //                picture:profile._json.picture
                
    //             }).save()
    //            .then((user)=>{
    //                done(null,user)
    //            })
    //       }
    //  })
        const existingUser =await User.findOne({userId:profile.id});
        if(existingUser){
            done(null,existingUser)
        }else{
            const newUser= new User({
                    suserId:profile.id,
                    susername:profile.displayName,
                    picture:profile._json.picture
            });
            const user=await newUser.save();
            done(null,user);
        }
    }
    )
    
)

// for facebaook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    proxy:true,
  },
  async(accessToken, refreshToken, profile,done)=>{
//     console.log(profile)
//         User.findOne({userId:profile.id})
//         .then((existingUser)=>{
//             if(existingUser){
//                 done(null,existingUser)
//             }else{
//                 new User({
//                userId:profile.id,
//                username:profile.displayName,
//                picture:profile._json.picture
            
//             }).save()
//            .then((user)=>{
//                done(null,user)
//            })
//       }
//  })
console.log(profile)
            const existingUser =await User.findOne({userId:profile.id});
            if(existingUser){
                done(null,existingUser)
            }else{
                const newUser= new User({
                        suserId:profile.id,
                        susername:profile.displayName,
                        picture:profile._json.picture
                });
                const user=await newUser.save();
                done(null,user);
            }

}
));