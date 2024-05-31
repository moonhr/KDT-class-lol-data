/**
 * * json배열 분해하여 배열에 삽입
 * @param {jsonArr} pushArr
 * @param {arr} tagArr 
 * @param {arr} contentArr 
 */
function getJsonData(pushArr, tagArr, contentArr) {
  pushArr.forEach(element => {
    let json = element
    json.forEach(element => {
      let elem = element.split(",")
      for (let arr = 0; arr < tagArr.length; arr++) {
        if (elem[0].includes(contentArr[arr])) {
          tagArr[arr].push(elem[0].split('=')[1])
        }
      }
    })
  })
};

module.exports = getJsonData;