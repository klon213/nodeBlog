var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var mysqlConnection = require('./libs/mysql.js');


var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


passport.use(new BearerStrategy({
    },
    function(token, done) {
        // asynchronous validation, for effect...
        process.nextTick(function () {

            // Find the user by token.  If there is no user with the given token, set
            // the user to `false` to indicate failure.  Otherwise, return the
            // authenticated `user`.  Note that in a production-ready application, one
            // would want to validate the token for authenticity.
            findByToken(token, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user);
            })
        });
    }
));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', routes);
app.use('/users', /*passport.authenticate('bearer', { session: false }),*/ users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*
function findByToken(token, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.token === token) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}
*/

function findByToken(token, fn) {
    console.log('searchin..');
    var sql = "SELECT * FROM user WHERE token=?";
    mysqlConnection.query(sql, token, function(err, result) {
        if(result) {
            return fn(null, result[0]);
            //return result[0];
        }
    });

   // return result;
}


module.exports = app;
