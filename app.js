
    require('dotenv').config()
    const express = require('express');
    const ejs = require('ejs');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const passport = require('passport');
    const passportLocalMongoose = require('passport-local-mongoose');


    const app = express();

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
            email:String,
            password:String
        });

        // Add the Passport-Local-Mongoose plugin to your user schema
        userSchema.plugin(passportLocalMongoose);

        const User = mongoose.model('User',userSchema);

        passport.use(User.createStrategy());

        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());

        app.get("/",(req,res)=>{
            res.render('home');
        });
        
        app.get("/register",(req,res)=>{
            res.render('register');
        });

        app.get("/secrets",(req,res)=>{
            if(req.isAuthenticated()){
                res.render("secrets")
            }else{
                res.redirect("/login");
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
        
        app.listen(3000,()=>{
            console.log("Server is runing on port 3000...   ");
        });


    }

