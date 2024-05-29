const http = require("http");
const fs = require("fs");
const memberNames = require("./module/name.js");
const chamName = require("./module/champion.json")

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

  function a(){
    console.log("asdasd");console.log("asdasd");console.log("asdasd");
  }

  function b(){
    a();a();a();a();a();a();a();a();a();a();a();a();a();a();a();a();a();
  }

  function c(){
    b();b();b();b();b();b();b();b();b();b();b();b();b();b();b();b();b();
  }

}