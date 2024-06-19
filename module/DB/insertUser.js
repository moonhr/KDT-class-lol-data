const createDatabase = require('./createDatabase');

const  insertUser = (data, callback) => {
  createDatabase((err, db) => {
      if (err) {
          return callback(err);
      }
      let insertStmt = db.prepare(`INSERT INTO users (name, line, cham) VALUES (?, ?, ?)`);
      insertStmt.run(data.name, data.line, data.cham, function(err) {
          insertStmt.finalize();
          db.close();
          callback(err, this.lastID);
      });
  });
}

module.exports = insertUser;