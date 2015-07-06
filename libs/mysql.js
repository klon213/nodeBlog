var mysql = require('mysql');
var config = require('../config');
//var connection = mysql.createConnection(config.get('mysql'));

var connection      =    mysql.createPool({
	connectionLimit : 100, //important
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'blog',
	debug    :  false
});

module.exports = connection;