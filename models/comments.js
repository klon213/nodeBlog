var mysqlConnection = require('../libs/mysql.js');

var comment = {};

var table_name = 'comments';

comment.create = function(requestData, next) {
    var sql = "INSERT INTO " + table_name + " (article_id, user_id, text, created_at) VALUES(?, ?, ?, ?)";
    mysqlConnection.query(sql, [requestData.article_id, requestData.currentUserId, requestData.text, Date.now()], function(err, result) {
        next(result);
    })
};

comment.view = function(id, next) {
    var sql = "SELECT c.id, c.user_id, c.text, c.created_at, user.id as uid, user.login, user.userpic FROM " + table_name + " c INNER JOIN user on user.id=c.user_id WHERE c.id=?";
    mysqlConnection.query(sql, Number(id), function(err, result) {
    if(err) {
        console.log(err);
        return false;
    }
        //next(comment.format(result));
        next(result);
    });
};

comment.list = function(requestData,  next) {
    var sql = "SELECT c.id, c.user_id, c.text, c.created_at, user.id as uid, user.login, user.userpic FROM " + table_name + " c INNER JOIN user on user.id=c.user_id WHERE c.article_id=? LIMIT ?, ?";

    mysqlConnection.query(sql, [requestData.articleId, requestData.offset, requestData.limit], function(err, result) {
        if(err) {
            console.log(err);
            return false;
        }
    next(result);
    })
};

comment.modify = function(requestData, next) {
    var sql = "UPDATE comments SET text=? WHERE id=?";

    mysqlConnection.query(sql, [requestData.text, requestData.id], function(err, result) {
        if(err) {
            console.log(err);
            return false;
        }
        next(result);
    });
};

comment.delete = function(id, next) {
    var sql = "DELETE FROM comments WHERE id=?";

    mysqlConnection.query(sql, Number(id), function(err, result) {
        if(err) {
            console.log(err);
            return false;
        }
        next(result);
    });
};


/*adds separates profile in comments into separate object. Used on inner joined user to comments*/
comment.formatNestedProfile = function(objects, currentUserId, next) {
    objectsNum = objects.length;
    console.log(objectsNum);
    var result = [];
    var is_author = 0;

    for(var i=0; i<objectsNum; i++) {

        if(objects[i].uid == currentUserId)
            is_author = 1;
        else
            is_author = 0;

        tmpArray = {
            id: objects[i].id,
            user_id: objects[i].user_id,
            text: objects[i].text,
            created_at: objects[i].created_at,
            profile: {
                id: objects[i].uid,
                login: objects[i].login,
                userpic: objects[i].userpic
            },
            is_author: is_author
        };

        result.push(tmpArray);
    }

    next(result);
};

module.exports = comment;