const createDatabase = require('./createDatabase');

const deleteUser = (id, callback) => {
  createDatabase((err, db) => {
      if (err) {
          return callback(err);
      }
      let deleteStmt = db.prepare(`DELETE FROM users WHERE id = ?`);
      deleteStmt.run(id, function(err) {
          deleteStmt.finalize();
          db.close();
          callback(err);
      });
  });
}

module.exports = deleteUser;