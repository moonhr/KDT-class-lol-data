const fs = require("fs");

/**
 * * 생성된 html을 매개변수로 받아 읽는 함수
 * @param {*} req 
 * @param {*} res 
 */
function readHtml(req, res, add) {
  fs.readFile(path.join(__dirname, `./public/${add}.html`), (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 code는 서버 자체의 에러");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html;" });
    res.end(data);
  });
}

module.exports = readHtml;