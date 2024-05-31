const chamName = require("./champion.json");

/**
 * * 챔피언 이름이 존재하는지 검사
 * @param {chamInput} value 
 * @param {*} res 
 */
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

module.exports = chamCheck;