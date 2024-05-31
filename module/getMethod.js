const fs = require("fs");
/**
 * * get 메서드 함수
 * @param {요청} req 
 * @param {응답} res 
 * @param {경로} filePath 
 * @param {타입} contentType 
 */
function getMethod(req, res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found: 요청하신 파일을 찾을 수 없습니다.");
      console.log("오류 발생:", err);
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

module.exports = getMethod;