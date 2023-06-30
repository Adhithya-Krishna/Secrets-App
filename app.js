

    require('dotenv').config()
    const fs = require('fs');
    const key = fs.readFileSync('./key.pem');
    const cert = fs.readFileSync('./cert.pem');
    const express = require('express');
    const https = require('https');
    const ejs = require('ejs');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const passport = require('passport');
    const passportLocalMongoose = require('passport-local-mongoose');
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    const FacebookStrategy = require('passport-facebook').Strategy;
    const findOrCreate = require('mongoose-findorcreate');


    const app = express();
    const server = https.createServer({key: key, cert: cert }, app);

    app.use(express.static('public'));
    app.set('view engine','ejs');
    app.use(express.urlencoded({extended:true}));

    // Initialize express-session middleware

    app.use(session({
        secret:"Our little secret.",
        resave:false,
        saveUninitialized:true
    }))

    // Initialize Passport.js middleware
    app.use(passport.initialize());

    //passpot.session middleware if you want to support persistent login sessions
    app.use(passport.session());

    main().catch(console.error);

    async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
        
        const userSchema = new mongoose.Schema({
          email: String,
          password: String,
          googleId: String,
          facebookId: String,
          secret:String
        });

        // Add the Passport-Local-Mongoose plugin to your user schema
        userSchema.plugin(passportLocalMongoose);
        userSchema.plugin(findOrCreate);

        const User = mongoose.model('User',userSchema);

        passport.use(User.createStrategy());

        passport.serializeUser(function(user, cb) {
            process.nextTick(function() {
              return cb(null, {
                id: user.id,
                username: user.username
              });
            });
          });
          
          passport.deserializeUser(function(user, cb) {
            process.nextTick(function() {
              return cb(null, user);
            });
          });

        passport.use(new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "https://localhost:3000/auth/google/secrets",
            userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
          },
          function(accessToken, refreshToken, profile, cb) {
            // console.log(profile);
            User.findOrCreate({username: profile.displayName,googleId: profile.id }, function (err, user) {
              return cb(err, user);
            });
          }
        ));

        passport.use(new FacebookStrategy({
            clientID: process.env.APP_ID,
            clientSecret: process.env.APP_SECRET,
            callbackURL: "https://localhost:3000/auth/facebook/secrets"
          },
          function(accessToken, refreshToken, profile, cb) {
            // console.log(profile)
            User.findOrCreate({ username: profile.displayName,facebookId: profile.id}, function (err, user) {
              return cb(err, user);
            });
          }
        ));


        app.get("/",(req,res)=>{
            res.render('home');
        });

        app.get('/auth/facebook',
        passport.authenticate('facebook',{ scope: 'public_profile' }));
        app.get('/auth/facebook/secrets',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
          // Successful authentication, redirect home.
          res.redirect('/secrets');
        });

        app.get('/auth/google',
        passport.authenticate('google', { scope: ['profile'] }));

        app.get('/auth/google/secrets', 
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/secrets');
        });


        app.get("/register",(req,res)=>{
            res.render('register');
        });

        app.get("/secrets", async (req, res) => {
          try {
            const foundUsers = await User.find({ "secret": { $ne: null } });
        
            if (foundUsers) {
              res.render("secrets", { usersWithSecret: foundUsers });
            }
          } catch (err) {
            console.log(err);
            // Handle the error appropriately (e.g., send an error response)
          }
        });
        

        app.get("/submit",(req,res)=>{
          if(req.isAuthenticated()){
              res.render("submit")
          }else{
              res.redirect("/login");
          }
      });
      
      app.post("/submit", async (req, res) => {
        try {
          const submittedSecret = req.body.secret;
          const userID = req.user.id;
      
          const foundUser = await User.findById(userID);
      
          if (foundUser) {
            foundUser.secret = submittedSecret;
            await foundUser.save();
            res.redirect("/secrets");
          }
        } catch (err) {
          console.log(err);
          // Handle the error appropriately (e.g., send an error response)
        }
      });
      

        app.get("/logout",(req,res)=>{
            req.logOut((err)=>{
                if(err){
                    console.log(err);
                }else{
                    res.redirect("/");
                }
            });
            
        });

        app.post("/register",async(req,res)=>{
            const username = req.body.username;
            const password =req.body.password;
            User.register({username:username},password).then(()=>{
            const authenticate = passport.authenticate("local");
            authenticate(req,res,()=>{
                res.redirect("/secrets")
            });
            }).catch(err=>{
                console.log(err);
                res.redirect("/register");
            });
        });


        app.get("/login",(req,res)=>{
            res.render('login');
        });
        
        app.post("/login", passport.authenticate("local"), (req, res) => {
            res.redirect("/secrets");
          });
          ;
        
        server.listen(3000,()=>{
            console.log("Server is runing on port 3000...");
        });


    }

