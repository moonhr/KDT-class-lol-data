const server = require('./module/server.js');


// 서버를 포트 8080에서 시작
const port = 8080;
server.listen(port, (err) => {
  if (err) {
    console.log("오류:", err);
  } else {
    console.log(`http://localhost:${port}`);
  }
});

// const url = new URL()


const sqlite3 = require('sqlite3').verbose();

// 데이터베이스 파일에 연결 (파일이 없으면 자동으로 생성됩니다)
let db = new sqlite3.Database('lolData.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('lolData.db 성공');
});

// 테이블 생성
db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        line TEXT NOT NULL,
        cham TEXT NOT NULL
    )`);

// 데이터 삽입 (Create)
let insertStmt = db.prepare(`INSERT INTO users (name, email) VALUES (?, ?)`);
insertStmt.run('John Doe', 'john@example.com', function (err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`User John Doe added with ID ${this.lastID}`);
});

insertStmt.run('Jane Smith', 'jane@example.com', function (err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`User Jane Smith added with ID ${this.lastID}`);
});

insertStmt.finalize();

// 데이터 읽기 (Read)
db.each(`SELECT * FROM users`, (err, row) => {
  if (err) {
    throw err;
  }
  console.log(`${row.id}: ${row.name} - ${row.email}`);
});

// 데이터 수정 (Update)
let updateStmt = db.prepare(`UPDATE users SET name = ?, email = ? WHERE id = ?`);
updateStmt.run('John Updated', 'johnupdated@example.com', 1, function (err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`User 1 updated`);
});
updateStmt.finalize();

// 데이터 삭제 (Delete)
let deleteStmt = db.prepare(`DELETE FROM users WHERE id = ?`);
deleteStmt.run(2, function (err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`User 2 deleted`);
});
deleteStmt.finalize();

// 업데이트 후 데이터 읽기
db.each(`SELECT * FROM users`, (err, row) => {
  if (err) {
    throw err;
  }
  console.log(`${row.id}: ${row.name} - ${row.email}`);
});


// 연결 종료
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});