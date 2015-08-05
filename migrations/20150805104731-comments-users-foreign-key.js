var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addForeignKey('comments', 'user', 'fk_comments_user', {
    'user_id': 'id'
  }, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }, callback);
};

exports.down = function(db, callback) {
  db.removeForeignKey('comments', 'fk_comments_user', {
    dropIndex: true
  }, callback);
};
