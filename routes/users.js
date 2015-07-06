var express = require('express');
var router = express.Router();
var mysqlConnection = require('../libs/mysql.js');
var model = require('../models/user.js');
var futures = require('futures');
var md5 = require('MD5');

/* GET users listing. */
router.get('/', function(req, res, next) {

	mysqlConnection.getConnection(function(err,connection){
		connection.query("select * from user",function(err,rows){
			connection.release();
			if(!err) {
				res.json(rows);
			}
		});
	});

});

router.post('/', function(req, res, next) {

	mysqlConnection.getConnection(function(err, connection){
		console.log(req.body);
		res.json(req.body);
		//connection.query("insert into user set ")
	})

});

router.post('/signUp', function(req, res, next) {

            if(!req.body.login || !req.body.email || !req.body.password) {
                res.status(400);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({"validation": "login, email and password must be set!"}));
            } else
            model.create({
                    login: req.body.login,
                    email: req.body.email,
                    password: req.body.password,
                    userpic: req.body.userpic
                }, function(result){
                    if(result == 1) {
                        var errorText = "Email " + req.body.email + " already exists";
                        res.status(422);
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({"email": errorText}));
                    }
                    if(result == 2) {
                        var errorText = "Login " + req.body.login + " already exists";
                        res.status(422);
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({"login": errorText}));
                    }
                        model.view(result.insertId, function (result) {
                            res.json(result[0]);
                        });

                }
            );
});

router.post('/login', function (req, res, next) {
    model.login(req.body.email, md5(req.body.password+"trinity"), function(result) {
        if(result == 1) {
            res.status(400);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({"status": "Unauthorized"}));
        } else {
            res.json(result[0]);
        }
    });
});

module.exports = router;
