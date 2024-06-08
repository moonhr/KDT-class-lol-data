const menus = {
  name: document.getElementById('name.menu'),
  line: document.getElementById('line.menu'),
  cham: document.getElementById('champion.menu')
};

document.getElementById('name').addEventListener('input', sendReq);
document.getElementById('line').addEventListener('input', sendReq);
document.getElementById('cham').addEventListener('input', sendReq);

// menus.key.addEventListener('input',sendReq);

/**
 * * POST서버로 요청을 보내고 받은 응답으로 함수를 실행
 */
//promise값을 반환하는 비동기 함수
async function sendReq() {
  //this는 이벤트가 실행된 각각의 객체
  let elem = this;
  //http 요청 생성
  await fetch("http://localhost:8080/check", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    //body에 json 문자열 반환
    body: JSON.stringify({
      id: elem.id,
      value: elem.value
    }),
  })
    .then(res => {
      if (res.status == 200) {
        menuOn(elem.id, true);
      } else {
        menuOn(elem.id, false);
      }
    })
    .catch(err => {
      console.error("요청 중 오류 발생:", err);
      menuOn(false);
    });
}

/**
 * * 응답 시 반응 class 추가 삭제
 * @param {string} id
 * @param {boolean} isTurnOn 
 */
function menuOn(id, isTurnOn) {
  const menu = menus[id];
  if (isTurnOn) {
    menu.classList.add('menu100');
    menu.classList.remove('menu20');
  }
  else {
    menu.classList.add('menu20');
    menu.classList.remove('menu100');
  }

  // todo 만들조건 : menu에 모두 menu100클래스가 들어있는가? + input line의 값이 none이 아닌가?
  // * 모두 참이면 버튼의 hidden 클래스 제거
  if (menus.name.classList.value === "menu menu100" && menus.line.classList.value === "menu menu100" && menus.cham.classList.value === "menu menu100" && document.getElementById('line').value !== "none") {
    document.getElementById('submit').classList.remove('hidden');
  } else {
    document.getElementById('submit').classList.add('hidden');
  }
}