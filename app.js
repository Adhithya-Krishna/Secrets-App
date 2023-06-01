
require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));


main().catch(console.error);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
    
    const userSchema = new mongoose.Schema({
        email:String,
        password:String
    });

    const User = mongoose.model('User',userSchema);

    app.get("/",(req,res)=>{
        res.render('home');
    });
    
    app.get("/register",(req,res)=>{
        res.render('register');
    });

    app.post("/register",async(req,res)=>{
        try {
            const hash = await bcrypt.hash(req.body.password, saltRounds);
            const newUser = new User({
                email:req.body.username,
                password:hash
            });
            const result = await newUser.save();
            if(result){
                res.render('secrets');
            }else{
                console.log("Login Failed");
            }
        } catch (err) {
            console.log(err);
        }
    });


    app.get("/login",(req,res)=>{
        res.render('login');
    });
    
    app.post("/login",async(req,res)=>{
        const username = req.body.username;
        const password = req.body.password;

        try {
            const foundUser = await User.findOne({email:username})
            if(foundUser){
                const result = await bcrypt.compare(password,foundUser.password);
                if(result){
                    res.render('secrets')
                }else{
                    console.log("Password does not Match!")
                }
            }else{
                console.log("User Not found...")
            }
        } catch (err) {
            console.log(err);
        }
    });
    
    app.listen(3000,()=>{
        console.log("Server is runing on port 3000...   ");
    });


}

