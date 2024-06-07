const readData = require('./readData')
const getJsonData = require('./module/getJsonData.js')
const readHtml = require('./module/readHtml.js')
const fs = require('fs')


function makeHTML(req, res){
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
}

module.exports = makeHTML;