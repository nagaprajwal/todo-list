//jshint esversion:6
const express=require("express");
const bodyparser=require("body-parser");
const date= require(__dirname+"/date.js");

const app=express();

const bcrypt = require('bcrypt');
const saltRounds = 10; //salt rounds for bcrypt

app.use(bodyparser.urlencoded({extended:true}));// for using the body parser

app.use(express.static("public"))// specifiying the website to use the css file in our repo

app.set('view engine', 'ejs');   //telling app to use ejs
//usually all the html or ejs files are in views folder the view engine will view the view folder to render the html page 
var items=["buy food","cook food","eat food"];
var workitems=[];


var mysql=require("mysql");
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"todo",
    password:"naga"
});

con.connect((err)=>{
if(err){
    throw err;
}

console.log("database connected!");
})


app.get("/register",async(req,res)=>{

    res.render("register");
    console.log('getin');
});

app.post("/register",async(req,res)=>{
    con.query('select email from user where email= ?',[req.body.email],(err,result)=>{
        if(err){
            console.log(err);
        }
         if(res.length>0){
            console.log("user already exitst");
            res.render("register");

        }
        
    })
   let hashed=await bcrypt.hash(req.body.passwd,saltRounds);
 con.query("INSERT INTO user values(?,?,?)",[req.body.last , req.body.email , hashed],(err,data)=>{
    if(err){
        console.log(err);
    }
    else{
        res.redirect("/login");
        console.log(data);
    }
 });

});

app.get("/login",function(req,res){
res.render("login");

});

app.post("/login",async(req,res)=>{
    con.query("select * from user where email=?",[req.body.email],function(err,data){
        console.log(data);
        bcrypt.compare(req.body.passwd,data[0].password,(err,check)=>{
            if(err){
                console.log(err);
            }
            else{
                res.redirect('/');
            }
        })
        // if(req.body.passwd===data[0].password){
          
        // }
        // else {
        //     res.render("login");
        // }
    })
});



app.get('/',function(req,res){

    let day=date.getday();
   res.render('list',{listtitle:day, newlistitem:items});
    
});

app.post("/",async(req,res)=>{
    let item=req.body.newItem;
    if(req.body.list=== "work"){
        workitems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect('/'); 
    }
  
});
app.post("/",function(req,res){
    con.query("insert into items values(?)",[req.body.newItem],function(err,data){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    })
});


app.get('/work',function(req,res){
    res.render("list",{listtitle:"work items",newlistitem:workitems});
});

app.post("/work",function(req,res){
    let worki= req.body.newItem;
    workitems.push(worki);
    res.redirect("/work"); 
});

app.get('/about',function(req,res){
res.render('about');
});
const port=process.env.PORT ||3000;
app.listen(port,function() {
 console.log("port initialized at channel 3000");   
})
