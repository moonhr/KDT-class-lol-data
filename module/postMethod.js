const makeHTML = require('./makeHTML.js');

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

module.exports = postMethod;