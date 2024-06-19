const createDatabase = require('./createDatabase');

const getUsers = (callback) => {
  createDatabase((err, db) => {
      if (err) {
          return callback(err);
      }
      db.all(`SELECT * FROM users`, (err, rows) => {
          db.close();
          callback(err, rows);
      });
  });
}

module.exports = getUsers;