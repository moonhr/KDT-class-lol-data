const http = require("http");
const fs = require("fs");
const path = require("path");
const NameCheck = require('./module/nameCheck.js');
const chamCheck = require('./module/chamCheck.js');
const getMethod = require('./module/getMethod.js');
const makeHTML = require('./module/makeHTML.js');
const deleteJson = require('./module/deleteJson.js');


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
    }
    else if (req.url === "/submit") {
      postMethod(req, res);
    }
  }
  if (req.method === "DELETE") {
    deleteJson(req, res);
  }
})







/**
 * * POST 메서드일 때 실행될 함수
 * * data의 json을 읽어 새로운 html을 만들고 /submit으로 내보냄
 * @param {요청} req 
 * @param {응답} res 
 */
function postMethod(req, res) {
  let body = "";

  req.on('data', (data) => body += data);
  req.on('end', () => {
    try {
      let arrData = decodeURI(body).split("&");
      let name = arrData[0].split('=')

      //들어온 값으로 파일 생성
      fs.writeFileSync(`./data/${name[1]}.json`, JSON.stringify(arrData), 'utf8', (err) => {
        if (err) {
          console.log(err);
        }
      })
      //json값으로 html만들고 읽기
      makeHTML(req, res);

    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "잘못된 요청입니다." }));
      console.log("오류 발생:", err);
    }
  })
}

/**
 * * /check로 들어올 때 실행되는 함수
 * * input에 들어온 name, champion이 데이터의 값과 일치하는지 확인함
 * @param {요청} req 
 * @param {응답} res 
 */
function postCheck(req, res) {
  let body = "";

  req.on('data', (data) => body += data);
  req.on('end', () => {
    try {
      //들어온 값 json으로 정리
      let elem = JSON.parse(body);

      let id = elem.id;
      let value = elem.value;

      if (id == "name") {
        NameCheck(value, res);
      }

      if (id == "cham") {
        chamCheck(value, res);
      }

      res.statusCode = 200;
      res.end();

    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "잘못된 요청입니다." }));
      console.log("오류 발생:", err);
    }
  })
}





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
      return path.join(__dirname, "./public/index.html");
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
const port = 8080;
server.listen(port, (err) => {
  if (err) {
    console.log("오류:", err);
  } else {
    console.log(`http://localhost:${port}`);
  }
});
