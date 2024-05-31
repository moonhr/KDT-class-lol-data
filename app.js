const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const memberNames = require("./module/name.js");
const chamName = require("./module/champion.json");
const readData = require('./readData.js');

// class ReqData {
//   constructor(id, value) {
//     this.id = id;
//     this.value = value;
//   }
// }

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
})



/**
 * * get메서드
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

/**
 * * post메서드
 */
function postMethod(req, res) {
  let body = "";

  req.on('data', (data) => body += data);
  req.on('end', () => {
    try {
      //json데이터 배열에 밀어넣기
      let jsondata = [];
      readData(jsondata);
      // console.log(jsondata);

      //들어온 값 쪼개서 태그만들기
      let nameTagArr = [];
      let lineTagArr = [];
      let chamTagArr = [];
      jsondata.forEach(element => {
        let json = element
        json.forEach(element => {
          let elem = element.split(",")
          //console.log(elem[0]);
          // console.log(typeof elem[0]); 
          if(elem[0].includes("name")){
            nameTagArr.push(elem[0].split('=')[1])
          }
          if(elem[0].includes("line")){
            lineTagArr.push(elem[0].split('=')[1])
          }
          if(elem[0].includes("cham")){
            chamTagArr.push(elem[0].split('=')[1])
          }
        });
      });

      let dataUl = [];
      for(let i = 0; i < nameTagArr.length; i++){
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
        </div>
      </body>
      </html>`;
      
      if (req.url === "/submit") {
        // readHtml(req, res);
        fs.writeFileSync(`./public/submit.html`, submitHTML, "utf-8");
        fs.readFileSync(path.join(__dirname, `./public/submit.html`), (err) => {
          if (err) {
            console.log(err);
          }
        });
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

function readJSON (name){
  fs.readFile(path.join(__dirname, `./data/${name}.json`), (err) => {
    if (err) {
      console.log(err);
    }
  })
}

//지금 안씀
function readHtml(req, res) {
  fs.readFile(path.join(__dirname, "./public/submit.html"), (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 code는 서버 자체의 에러");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html;" });
    res.end(data);
  });
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

//* 이름 검사 함수
function NameCheck(value, res) {
  const name = memberNames.find(function (str) {
    return str === value;
  });

  if (!name) {
    throw new Error("이름이 없습니다.");
  }
}

//* 챔피언 검사 함수
function chamCheck(value, res) {
  //* 챔피언 이름만 담을 빈 배열 만들기
  let chams = [];
  //* json 데이터에서 이름 객체 뽑아서 배열에 밀어넣기
  for (let data in chamName) {
    if (data === "data") {
      for (let a in chamName[data]) {
        for (let b in chamName[data][a]) {
          if (b === 'name') {
            chams.push(chamName[data][a][b]);
          }
        }
      }
    }
  }
  const cham = chams.find(str => str === value);
  if (!cham) {
    throw new Error("존재하는 챔피언이 없습니다.");
  }
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
    console.log(`Server is running on port ${port}`);
  }
});
