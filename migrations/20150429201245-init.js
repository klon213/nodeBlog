var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('user', {
		id: { type: 'int', primaryKey: true },
		login: 'string',
        email: 'string',
		password: 'string',
        userpic: 'text',
        token: 'text',
		created_at: { type: 'int'},
		updated_at: 'int'
	}, callback);
};

exports.down = function(db, callback) {
	db.dropTable('user', {},
  callback);

};
