require('dotenv').config()
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')
const errorHandler = require('./utils/errorHandler');
const mongoose = require("mongoose");
const cookieSession = require('cookie-session');
const passport = require("passport");
// const GooleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const Suser= require('./models/Suser');
require("./services/passport");


/**Import routing file */
const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
const categoryRoutes = require('./routes/category.route');
const commentRoutes = require('./routes/comment.route');
// const suserRoutes = require('./routes/suser.route');
app.use(helmet())
app.use(bodyParser.json())
// app.use(express.static(path.join(__dirname, 'public')))

// app.use(passport.initialize());
// app.use(passport.session())

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, AuthorizationToken')
    next()
})
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/comment',commentRoutes);
// app.use('/api/v1/suser',suserRoutes);

app.use(
    cookieSession({
        maxAge:30 * 24 * 60 * 60 *1000,
        keys:[process.env.COOKIE_KEY]
    })
)

app.use(passport.initialize());
app.use(passport.session())



app.get('/auth/google',passport.authenticate('google',{
    scope:['profile','email']
}))


app.get("/auth/google/callback",passport.authenticate('google'),(req,res)=>{
    res.redirect('/profile')
})

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get("/auth/facebook/callback",passport.authenticate('facebook',{
    successRedirect:'/profile'
}))
app.get("/profile",(req,res)=>{
    res.send("success");
})

app.get('/api/current_user',(req,res)=>{
    res.send(req.user)
})

app.use(errorHandler.invalidEndPoint);

app.use((error, request, response, next) => {
    return response.status(250).json(errorHandler.makeErrorResponse(error))
})



// Client ID=268745083805-3a86j6h1rguo1oorl072phjjqv195tja.apps.googleusercontent.com
//Client Secret=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


let PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Server is running at port ${process.env.PORT} successfully.`);
});

mongoose.connect(process.env.MONGO_URI).then(console.log("connected to mongoDB")).catch
((err)=>{console.log(err)});
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

