const http = require("http");
const dotenv = require("dotenv");
const path = require("path");
const getMethod = require("./module/getMethod.js");
const postMethod = require("./module/postMethod.js");
const deleteJson = require("./module/deleteJson.js");
const postCheck = require("./module/postCheck.js");

dotenv.config();

//*서버 생성
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
    } else if (req.url === "/submit") {
      postMethod(req, res);
    }
  }
  if (req.method === "DELETE") {
    deleteJson(req, res);
  }
});

//*문서 형식에 따른 표기
const mimeType = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
};

//*url에 따른 파일 경로 결정 함수 객체
const fileUtils = {
  //*매개변수 url에 따른 파일 경로 할당
  getFilePath: function (url) {
    // URL에 따라 파일 경로를 설정
    if (url === "/") {
      return path.join(__dirname, "./index.html");
    } else {
      return path.join(__dirname, `./public${url}`);
    }
  },
  //*파일 경로에 따른 파일 확장자 가져오기
  getFileExtension: function (filePath) {
    //*파일 확장자를 가져오는 명령어
    let ext = path.extname(filePath);
    //*파일 확장자 소문자로 변환
    return ext.toLowerCase();
  },
  //*파일 확장자에 따른 표기 반환
  getContentType: function (ext) {
    //*mimeType에 ext로 가져온 확장자가 있다면 표기 반환
    if (mimeType.hasOwnProperty(ext)) {
      return mimeType[ext];
    } else {
      return "text/plain";
    }
  },
};

// 서버를 포트 8080에서 시작
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
