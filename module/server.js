const http = require("http");
const getMethod = require('./getMethod.js');
const postMethod = require('./postMethod.js');
const deleteJson = require('./deleteJson.js');
const fileUtils = require('./fileUtils.js');

/**
 * * 서버생성
 */
const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") return;
  //*filePath라는 변수를 getFilePath에 req.url을 매개변수로 삽입한 값으로 할당
  let filePath = fileUtils.getFilePath(req.url);
  //*ext 변수는 getFileExtenstion에 filePath를 삽입한 값으로 할당
  let ext = fileUtils.getFileExtension(filePath);
  //*contentType 변수는 getContentType에 ext를 삽입한 값으로 할당
  let contentType = fileUtils.getContentType(ext);
  if (req.method === "GET") {
    getMethod(req, res, filePath, contentType);
  }

  if (req.method === "POST") {
    if (req.url === "/check") {
      postCheck(req, res);
    }
    else if (req.url === "/submit") {
      postMethod(req, res);
    }
  }
  if (req.method === "DELETE") {
    deleteJson(req, res);
  }
})


module.exports = server;