const dataJsonName = require('./dataJsonName.js');

/**
 * * DELETE메서드일 때 실행될 함수
 * * json을 삭제하는 역할
 * @param {요청} req 
 * @param {응답} res 
 */
function deleteJson(req, res) {
  // 1. 요청 id(이벤트타켓)이 json파일의 명에 존재하면
  // 2. 해당 json파일을 삭제한다

  // ? json주소가 서버로 인코딩되어 들어온다.
  const jsonName = [];
  dataJsonName(jsonName);

  //req.url값을 decode하기
  let fileName = req.url.split('/')[2]
  fileName = decodeURI(fileName);

  jsonName.forEach(element => {
    //JSON 파일을 삭제
    try {
      if (element == fileName) {
        //파일 삭제
        fs.unlink(`./data/${fileName}.json`, (error) => { console.log(error) })
        res.statusCode = 200;
        res.end();
      }
    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "잘못된 요청입니다." }));
      console.log("오류 발생:", err);
    }
  });
}

module.exports = deleteJson;