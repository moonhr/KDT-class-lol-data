const memberNames = require("./name.js");

/**
 * * 이름 검사하는 함수
 * @param {nameInput} value 
 * @param {*} res 
 */
function NameCheck(value, res) {
  const name = memberNames.find(function (str) {
    return str === value;
  });

  if (!name) {
    throw new Error("이름이 없습니다.");
  }
}

module.exports = NameCheck;