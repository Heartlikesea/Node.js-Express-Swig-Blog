/**
 * Created by Administrator on 2017/6/12 0012.
 */
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser=require('body-parser');
app.use('/public',express.static(__dirname+'/public'));
var swigs=require('swig');
app.set('view engine','html');
app.engine('html',swigs.renderFile);
app.set('views','./views');


swigs.setDefaults({cache:false});
app.use(bodyParser.urlencoded({extended:true}));

var Cookies=require('cookies');
var userDBs = require('./model/userDB');
app.use(function(req,res,next){
    req.cookies=new Cookies(req,res);

    if(req.cookies.get('userInfo')){
        try {
            req.userInfo=JSON.parse(req.cookies.get('userInfo'));

            userDBs.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);

                next();
            });
        }catch(e){
            next();
        }
    }else{
        next();
    }
});
mongoose.Promise = require('bluebird');

app.use('/',require('./routers/main'));
app.use('/logins', require('./routers/login'));
app.use('/admins', require('./routers/admin'));
app.use('/category', require('./routers/categoryAdmin'));
mongoose.connect('mongodb://localhost:27018/blog',function (err) {
    if(err){
        console.warn('mongoDB connect Error');
    }else
    {
        console.warn('mongoDB connect Success');
        app.listen(9001);
    }
});




