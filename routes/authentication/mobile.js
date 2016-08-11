var express = require('express');
var Mobile = express.Router();
var Mongo = require("./../../classes/mongo.js");
var request = require('request');

Mobile.post('/', function(req, res){
    var tokenGoogle = req.query.token;
    var headers = {'Content-Type': 'x-www-form-urlencoded'};
    var body = {grant_type: 'authorization_code',
                client_id: '489399558653-rde58r2h6o8tnaddho7lathv2o135l7m.apps.googleusercontent.com',
                client_secret: 'QlGfYitSzTxQv0PlhWXer8xh',
                redirect_uri: '',
                code: tokenGoogle};

    console.log('código pra pegar o token - '+ tokenGoogle);
    request.post({
        url:"https://www.googleapis.com/oauth2/v4/token",
        headers:headers,
        form:body
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parse = JSON.parse(body);
            var access_token = parse.access_token;
            console.log( 'okay - token: ' + access_token);
            acessarToken(req, res, access_token);
        }
        else{
            console.log('fail na primeira requisição'); 
        }
    });
});

function acessarToken(req, res, access_token){
    request({
        uri:"https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + access_token,
        method:'GET'},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var parse = JSON.parse(body);
                var name = parse.name;
                var domain = parse.hd;
                console.log('nome - ' + name + ' dominio - ' + domain);
                verificarGrupo(req, res, access_token, name, domain);
            }
            else{
                console.log('fail na segunda requisição');
            }
        }
    )
}

function verificarGrupo(req, res, access_token, name, domain){
    if (domain == "digitaldesk.com.br") {
        consultarUsuario(req, res, access_token, name);
        console.log('e-mail valido');
    }    
    else {
        console.log('email inválido');
        res.send({status: false});
    }
}

function consultarUsuario(req, res, access_token, name){
    Mongo.find({name: name}, 'user', res, function(res, userObj){
        console.log('usuario encontrado');
        console.log('token no banco - ' + JSON.stringify(userObj[0].devices[1].value));
        var token = userObj[0].devices[1].value;
        conferirToken(req, res, token, access_token, name);
    },function(req, res){
        console.log('usuario não encontrado');
        cadastrarUsuario(req, res, access_token, name);
    });
}

function cadastrarUsuario(req, res, access_token, name){
    var insertObj = {name: name, role: "", status: "A", devices: [{status: "I", name: "touch", value: "", timeRange: ""}, {status: "A", name: "mobile", value: access_token, timeRange: ""}, {status: "I", name: "nfc", value: "", timeRange: ""}]};    
    Mongo.insert(insertObj, 'user', function(){});
    res.send({status: true, token: access_token});
    console.log('usuario cadastrado');
}

function conferirToken(req, res, token, access_token, name){
    if(access_token==token){
        res.send({status: true, token: access_token});
        console.log('token correto');
    }
    else {
        atualizarToken(req, res, access_token, name);
    }
}

function atualizarToken(req, res, access_token, name){
    Mongo.update({name: name}, 'user', req, function(userObj, req){
        userObj.devices[1].value = access_token;
        console.log('token atualizado');
        console.log(access_token);
        console.log(userObj[0].devices;
        return userObj;
    });
    res.send({status: true, token: access_token});
}

module.exports = Mobile;