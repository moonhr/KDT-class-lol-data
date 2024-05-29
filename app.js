const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const memberNames = require("./module/name.js");
const chamName = require("./module/champion.json")

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * * 서버실행
 */
http.createServer((req,res) => {
  //* GET METHOD
  if(req.method === "GET"){
    getMethod(req,res);
  }
  //* POST METHOD
  if(req.method === "POST"){
    postMethod(req,res);
  }
}).listen(8080);

/**
 * * get메서드
 */
function getMethod(req, res){
  
  //* Main Html
  if(req.url ==='/'){
    SelectFile(res, 'index.html', "text/html");
    return;
  }

  //* OTHER FILE
  else ReadFiles(req,res);
}

/**
 * * post메서드
 */
function postMethod(req, res){
  let body = "";

  req.on('data',  (data) => body += data );
  req.on('end', async () => {
    
    let elem =JSON.parse(body);
    let id = elem.id;
    let value = elem.value;

    if(id == "name"){
      NameCheck(value, res);
    }

    else if(id == "cham"){
      chamCheck(value, res);
    }

    res.statusCode = 200;
    res.end();
  })  

}

//* 이름 검사 함수
function NameCheck(value, res){
  const name = memberNames.find(str => str === value);
  if(name){
    res.statusCode = 200;
    res.end();
  }
  else{
    res.statusCode = 204;
    res.end();
  }
}

//* 챔피언 검사 함수
function chamCheck(value, res){
//* 챔피언 이름만 담을 빈 배열 만들기
let chams = [];
//* json 데이터에서 이름 객체 뽑아서 배열에 밀어넣기
for(let data in chamName){
  if(data === "data"){
    for(let a in chamName[data]){
      for(let b in chamName[data][a]){
        if(b === 'name'){
          // console.log(chamName[data][a][b]);
          // let cham = [];
          chams.push(chamName[data][a][b]);
        }
      }
    }
  }
}
  const cham = chams.find(str => str === value);
  if(cham){
    res.statusCode = 200;
    res.end();
  }
  else{
    res.statusCode = 204;
    res.end();
  }
}

function ReadFiles(req, res){
  //* Resource 같은 경우 대용량 파일이 대부분이다.
  //* createReadStream을 이용하여 파일을 읽는다.
  if(req.url.startsWith("/resources/")){
    const reqEtag = req.headers['if-none-match'];
    //* 버전에 맞는 이미지 파일인지 확인
    if(reqEtag != undefined && reqEtag === process.env.RIOT_DATA_VERSION){
      res.writeHead(304);
      res.end();
    }
    else{
      res.setHeader('ETag', process.env.RIOT_DATA_VERSION);
      res.setHeader('Content-Type', GetContentType(req.url));
      //* 캐시를 설정하여 해당 Resouce를 저장한다.
      res.setHeader('Cache-Control', 'public, no-transform, max-age=15552000');
      ReadResouceFile(req.url, res);
    }
  }
  //* 일반 문서 파일들
  else{
    SelectFile(res, req.url, GetContentType(req.url));
  }
}