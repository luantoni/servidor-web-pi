var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/authentication');

function mongo(collection, modelObj){
    this.model = mongoose.model(collection, modelObj);
}

mongo.prototype.find = function(queryObj, res, callback){
    this.model.findOne(queryObj, function (err, userObj) {
        if(err){
            console.log(err);
        }else if(userObj){
            var user = userObj.name;
            console.log(user);
            callback();
        }else{
            console.log('User not found!');
            res.sendStatus(404);
        }
    });
}

mongo.prototype.insert = function(newUserObj, callback){
    var newUser = new this.model(newUserObj);
    newUser.name = newUser.name.toUpperCase();
    console.log(newUser);
    newUser.save(function (err, userObj) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved successfully:', userObj);
            callback();
        }
    });
}

mongo.prototype.update = function(queryObj, callback){
    this.model.findOne(queryObj, function (err, userObj) {
        if (err) {
            console.log(err);
        } else if (userObj) {
            console.log('Found:', userObj);
            callback();
        //For demo purposes lets update the user on condition.
        /*if (userObj.age != 30) {
            //Some demo manipulation
            userObj.age += 30;

            //Lets save it
            userObj.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Updated', userObj);
                }
            });
        }*/
        } else {
            console.log('User not found!');
        }
    });
}

module.exports = new mongo();