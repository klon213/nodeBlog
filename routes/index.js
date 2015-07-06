var express = require('express');
var router = express.Router();
var mysqlConnection = require('../libs/mysql.js');

/* GET home page. */
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




module.exports = router;
