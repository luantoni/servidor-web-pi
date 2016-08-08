var express = require('express');
var token = express.Router();
var Mongo = require("./../../classes/mongo.js");
var lock = require('./../../actions/lock.js');

token.post('/', function(req, res){
    var tokenGoogle = req.query.token;
    Mongo.find({devices: { $elemMatch: { value: tokenGoogle } }}, 'user', res, function(res, userObj){
    	lock('mobile', req.query.user);
    	//retornar algo pro front
    },function(req, res){
        res.sendStatus(404);
    });
});

module.exports = token;