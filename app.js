const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const memberNames = require("./module/name.js");
const chamName = require("./module/champion.json")

class ReqData {
  constructor(id, value){
    this.id = id;
    this.value = value;
  }
}

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
      if(req.url === "/check"){
        postMethod_2(req, res);
      }
      else if(req.url === "/submit"){
        postMethod(req, res);
      }
  }
  console.log(req.url);
})


function createJson(req, res) {
  fs.readFile(path.join(__dirname, "./public/submit.html"), (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 code는 서버 자체의 에러");
      return;
    }
    res.writeHead(200, {"Content-Type": "text/html;"});
    res.end(data);
  });
  // request.on('end', () => {
  //   const parseData = new URLSearchParams(body);
  //   const title = parseData.get("title");
  //   const content = parseData.get("content");
  //   const jsonData = {
  //     title: title,
  //     content: content
  //   };
  //   for (let key in jsonData) {
  //     if (key === "title") {
  //       var a = `<h1>${jsonData[key]}</h1>`;
  //     }
  //     else if (key === "content") {
  //       var b = `<h3>${jsonData[key]}</h3>`;
  //     }
  //   }

  //   fs.writeFileSync(`./data/${todayDate()}-data.json`, all, "utf-8");

  // })
}


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
      //let elem = JSON.parse(body);
      let arrData = decodeURI(body).split("&");
      const arrReqData = [];
      
      for(let data of arrData){
        let split = data.split("=");
        arrReqData[arrReqData.length] = new ReqData(split[0], split[1]);
      }
      
      for(let reqData of arrReqData){
        console.log(reqData.id);
        if(reqData.id == "name"){
          NameCheck(reqData.value, res);
        }

        if(reqData.id === "cham"){
          chamCheck(reqData.value, res);
        }
      }

      // let id = elem.id;
      // let value = elem.value;
      // if (id == "name") {
      //   NameCheck(value, res);
      // }

      // if(id == "cham"){
      //   chamCheck(value, res);
      // }
      // else if (id == "cham") {
      //   chamCheck(value, res);
      // }

      // res.statusCode = 200;
      // res.end();
      if(req.url === "/submit"){
        createJson(req, res);
      }
      else{
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

function postMethod_2(req, res) {
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

      if(id == "cham"){
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
  // if (name) {
  //   res.statusCode = 200;
  //   res.end();
  // }
  // else {
  //   res.statusCode = 204;
  //   res.end();
  // }
  if(!name){
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
            // console.log(chamName[data][a][b]);
            // let cham = [];
            chams.push(chamName[data][a][b]);
          }
        }
      }
    }
  }
  const cham = chams.find(str => str === value);
  // if (cham) {
  //   res.statusCode = 200;
  //   res.end();
  // }
  // else {
  //   res.statusCode = 204;
  //   res.end();
  // }
  if(!cham){
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
