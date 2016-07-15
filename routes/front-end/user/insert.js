var express = require('express');
var router = express.Router();
var mongo = require('./../../../classes/mongo/mongo.js');

router.post('/', function(req, res, next) {
    if(req.query.hasOwnProperty('user')){
        var insertObj = {name: req.query.user, key: "", mobile: req.query.mobile, nfc: "", status: "A"};
        mongo.insert(insertObj, 'user', function(){});
        res.sendStatus(200);
    }
    else {
        res.sendStatus(404);
    }
});

module.exports = router;