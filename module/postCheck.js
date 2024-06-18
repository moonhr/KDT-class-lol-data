const NameCheck = require('./nameCheck.js');
const chamCheck = require('./chamCheck.js');

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

module.exports = postCheck;