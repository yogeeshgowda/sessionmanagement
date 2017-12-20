
// var session = require('client-sessions');
var jwt = require('jsonwebtoken');
var pg = require('pg');
var Sequelize=require ('sequelize');
var app  = require('express')();// Express App include
var session = require('express-session');
var path = require('path');
var http = require('http').Server(app); // http server
var env = app.get('env') == 'development' ? 'dev' : app.get('env');
pg.defaults.ssl = process.env.DATABASE_URL != undefined;
var port = process.env.PORT || 8050;
var bodyParser = require("body-parser");// Body parser for fetch posted data
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); // Body parser use JSON data
app.use(cookieParser());

var express = require('express');
var router = express.Router();


app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 2000 ,expiresIn:400},resave: true , saveUninitialized: true}));

var superSecret = 'ilovescotchscotchyscotchscotch';
var sequelize = new Sequelize('postgres', 'postgres', 'Rajkumar@123', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  



 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","POST, GET, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//   next();
// });
//  server.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});


var auth = function(req, res, next) {
  if (req.session && req.session.user === req.body.email && req.session.pwd === req.body.pwd)
    return next();
  else
    return res.sendStatus(401);
};



  app.get('/Get',function(req,res){
    
   var data = {
        "Data":""
    };
     sequelize.query("SELECT * FROM persondetails", { type: sequelize.QueryTypes.SELECT})
  .then(function(persondetails,err,rows,fields) {
    
    if(persondetails){
    
           data["Data"] = persondetails;
            
            res.json({"err" : false, "message" : "success",data});
          
        }else 
        if(err)
          throw err;
  });
});

app.post('/Post',function(req,res){
 console.log('Hi');
  console.log(req.body);

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var pwd = req.body.pwd;
    var confirmpwd = req.body.confirmpwd;
    var email =req.body.email;
    var phone =req.body.phone;
   

    var data = {
        "Data":""
    };
   
   
  if(!!firstname && !!lastname && !!pwd && !!confirmpwd && !!email && !!phone) 
    {
//sequelize.query("INSERT INTO persondetails(firstName,lastname,pwd,confirmPwd) VALUES('" + firstName+ "','" + lastname+ "','" + pwd + "','" + confirmPwd+ "')",[firstName,lastname,pwd,confirmPwd],{type: sequelize.QueryTypes.INSERT}).then(function(persondetails,err) {
  sequelize.query("INSERT INTO persondetails (firstname,lastname,pwd,confirmpwd,email,phone) VALUES('" + firstname+ "','" + lastname+ "','" + pwd + "','" + confirmpwd+ "','" + email+ "','" + phone+ "')",[firstname,lastname,pwd,confirmpwd,email,phone],{type: sequelize.QueryTypes.INSERT}).then(function(persondetails,err) {
    
 if(!!err){ 
 
                data.Data = "Error Adding data";
            }else{
               
                data["Data"] = "Bird Added Successfully";
            }
            res.json(data);
        });
   }
    else{
        data["Data"] = "Please provide all required data of bird";
        
res.status(400).json(data);
    }
});


app.post('/login',function(req,res){
    console.log('hi');
    var emailFE = req.body.email;
    var pwdFE = req.body.pwd;
    console.log(emailFE);
    console.log(pwdFE);
    sequelize.query("SELECT * FROM persondetails",{type: sequelize.QueryTypes.SELECT}).then(function(persondetails,err) {
    
for (var i=0;i<=((persondetails.length)-1);i++){
     if((emailFE == persondetails[i].email)&& (pwdFE == persondetails[i].pwd)){
     // req.session.persondetails = persondetails;
     var token = jwt.sign({
             email: persondetails[i].email,
           pwd: persondetails[i].pwd
           }, superSecret, {
           expiresIn: 1 // expires in 24 hours
           // exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1hour expiration
           });
   
           // return the information including token as JSON
           res.json({
             success: true,
             message: 'Enjoy your token!',
             token: token
           });
      
      break;
     }
    else{
      console.log(err);
    
       res.status(400).send({message:"your email is not verified"});
    }
    }

    });
    
       
  });

app.post('/logout',function(req,res){
     console.log(req.session);
        
// req.session.destroy(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
    
    
//     console.log('hi');
//     console.log(req.session);
//     // if(req.session=='undefined'){
//     // 	console.log(path.join(__dirname+'/public/views/index.html'));
//     // res.sendFile(path.join(__dirname+'/public/views/index.html'));
//     // res.sendFile('a.html');
//     res.redirect('/index.html');
// // }
//   }
// });
if (req.session) {
    req.session.auth = null;
    res.clearCookie('auth');
    req.session.destroy(function() {});
  }
  res.redirect('/index.html');

});
  
   app.listen(port);
console.log('Magic happens on port ' + port);

 app.use(express.static(__dirname + '/'));
  app.get('*', function(req, res) {
     res.sendFile(path.join(__dirname + '/public/views/index.html'));
 });
  module.exports = app;
