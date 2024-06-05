//1. json 파일 이름 찾아오기 
//2. 클라에서 선택된 이벤트 id 값과 같은지
//3. 맞으면 삭제
const fs = require('fs')
const path = require('path')

/**
 * 배열에 data에 존재하는 json이름들을 넣어주는 함수
 * @param {빈배열} nameArr 
 */
function deleteTest(nameArr){
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
deleteTest(arr);
console.log(arr)