const fs = require('fs');

/**
 * * 디렉토리 data에서 json 내용을 꺼내 배열을 만드는 함수
 * @param {array} datalist 
 */
function readData(datalist) {
  let dataDir = fs.readdirSync(`./data`, (err) => {
    if (err) {
      console.log(err);
    }
  });
  for (let i = 0; i < dataDir.length; i++) {
    let dataJSON = fs.readFileSync(`./data/${dataDir[i]}`, (err) => {
      if (err) {
        console.log(err);
      }
    })
    datalist.push(JSON.parse(dataJSON));
  }
}
module.exports = readData;