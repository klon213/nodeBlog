var mysqlConnection = require('../libs/mysql.js');
var md5 = require('MD5');

var user = {};

var table_name = 'user';

user.create = function(requestData, next) {
    var sql = "SELECT * FROM " + table_name + " WHERE email=?";
        mysqlConnection.query(sql, requestData.email, function(err, result){

            if(result.length==0){
                var sql = "SELECT * FROM " + table_name + " WHERE login=?";
                mysqlConnection.query(sql, requestData.login, function(err, result){

                    if(result.length==0){
                         var sql = "INSERT INTO "+ table_name + " (login, email, password, userpic, token) VALUES (?, ?, ?, ?, ?)";
                         mysqlConnection.query(sql, [requestData.login, requestData.email, hashPassword(requestData.password), requestData.userpic, generateToken(requestData.login)], function(err, result) {
                         next(result)
                         });
                     } else {
                        next(2);
                    }
                });
            } else {
                next(1);
            }
        });
};

user.view = function(id, next) {
  var sql = "SELECT * FROM " + table_name + " WHERE id=?";
  mysqlConnection.query(sql, [id], function(err, result) {
      if(err) {
          console.log(err);
      }
      next(result)
  });
};

user.login = function(email, password, next) {
    var sql = "SELECT * FROM " + table_name + " WHERE email=? AND password=?";
    mysqlConnection.query(sql, [email, password], function(err, result) {
        if(err) {
            console.log(err);
        }
        if(result.length == 0) {
            next(1);
        }else {
            next(result)
        }
    })
};


function generateToken(login) {
    var timestamp = new Date().getTime();
    return md5('login'+ timestamp)
};

function hashPassword(password) {
    return md5(password + "trinity");
}

module.exports = user;
