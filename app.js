const http = require("http");
const fs = require("fs");
const path = require("path");
const readData = require('./readData.js');
const NameCheck = require('./module/nameCheck.js');
const chamCheck = require('./module/chamCheck.js');
const getMethod = require('./module/getMethod.js');
const getJsonData = require('./module/getJsonData.js');
const readHtml = require('./module/readHtml.js');
const dataJsonName = require('./module/dataJsonName.js')

//*서버 생성
const server = http.createServer((req, res) => {
  let url = req.url;
  if (req.url === "/favicon.ico") return;
  //*filePath라는 변수를 getFilePath에 req.url을 매개변수로 삽입한 값으로 할당
  let filePath = fileUtils.getFilePath(url);
  //*ext 변수는 getFileExtenstion에 filePath를 삽입한 값으로 할당
  let ext = fileUtils.getFileExtension(filePath);
  //*contentType 변수는 getContentType에 ext를 삽입한 값으로 할당
  let contentType = fileUtils.getContentType(ext);
  if (req.method === "GET") {
    getMethod(req, res, filePath, contentType);
  }
  //* POST METHOD
  if (req.method === "POST") {
    if (req.url === "/check") {
      postCheck(req, res);
    }
    else if (req.url === "/submit") {
      postMethod(req, res);
    }
  }
  if(req.method === "DELETE"){
    deleteJson(req, res);
  }
})

function deleteJson(req, res){
  // 1. 요청 id(이벤트타켓)이 json파일의 명에 존재하면
  // 2. 해당 json파일을 삭제한다

  //문제점 json주소가 서버로 인코딩되어 들어온다.
  const jsonName = [];
  dataJsonName(jsonName);
  console.log(req.url)
  let fileName = req.url.split('/')[2]
  console.log("디코드전" + fileName)
  fileName = decodeURI(fileName);
  console.log("디코드후"+fileName)
  // const jsonData = fs.readFileSync(`./data/${}.json`)


}





/**
 * * post메서드
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

      //json데이터 배열에 밀어넣기
      let jsondata = [];
      readData(jsondata);

      //들어온 값 쪼개서 태그만들기
      let nameTagArr = [];
      let lineTagArr = [];
      let chamTagArr = [];
      let tagArr = [nameTagArr, lineTagArr, chamTagArr];
      let contentArr = ["name", "line", "cham"];

      getJsonData(jsondata, tagArr, contentArr);

      let dataUl = [];
      for (let i = 0; i < nameTagArr.length; i++) {
        dataUl[i] = `<ul><li>${nameTagArr[i]}</li><li>${lineTagArr[i]}</li><li>${chamTagArr[i]}</li></ul>`
      }

      const submitHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <div id="root">
          <h1 id="title">What’s your position?</h1>
          <div>
            <h2>DATALIST</h2>
          </div>
          <div id="data-list-add">
            ${dataUl}
          </div>
          <a href="./index.html">홈으로</a>
        </div>
      </body>
      <script src="./submit.js"></script>
      </html>`;

      if (req.url === "/submit") {
        fs.writeFileSync(`./public/submit.html`, submitHTML, "utf-8");
        readHtml(req, res);
      }
      else {
        res.statusCode = 200;
        res.end();
      }
    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "잘못된 요청입니다." }));
      console.log("오류 발생:", err);
    }
  })
}


function postCheck(req, res) {
  let body = "";

  req.on('data', (data) => body += data);
  req.on('end', () => {
    try {
      let elem = JSON.parse(body);

      let id = elem.id;
      let value = elem.value;

      if (id == "name") {
        NameCheck(value, res);
      }

      if (id == "cham") {
        chamCheck(value, res);
      }
      else if (id == "cham") {
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
