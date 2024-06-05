const fs = require('fs')

/**
 * 배열에 data에 존재하는 json이름들을 넣어주는 함수
 * @param {빈배열} nameArr
 */
function dataJsonName(nameArr){
  let dataDir = fs.readdirSync(`./data`, (err) => {
    if (err) {
      console.log(err);
    }
  });
  dataDir.forEach(name => {
    // name = path.basename(dataDir, ".json")
    name = name.replace(".json","");
    nameArr.push(name);
  });
}

module.exports = dataJsonName;