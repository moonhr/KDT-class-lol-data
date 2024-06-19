const createDatabase = (callback) => {
    let db = new sqlite3.Database('lolData.db', (err) => {
        if (err) {
            return callback(err);
        }
        db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        line TEXT NOT NULL,
        cham TEXT NOT NULL
        )`, (err) => {
            callback(err, db);
        });
    });
}

module.exports = createDatabase;