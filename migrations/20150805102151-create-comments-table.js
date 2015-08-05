var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('comments', {
    id: {type: 'int', primaryKey: true},
    article_id: {type: 'int'},
    user_id: {type: 'int'},
    text: {type: 'text'},
    created_at: {type: 'int'}
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('comments', {}, callback);
};
