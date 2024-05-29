
const nameMenu = document.getElementById('name.menu')
const lineMenu = document.getElementById('line.menu')
const championMenu = document.getElementById('champion.menu')
const menus = [
  nameMenu, lineMenu, championMenu
]

document.getElementById('name').addEventListener('input',sendReq);
document.getElementById('line').addEventListener('input',sendReq);
document.getElementById('cham').addEventListener('input',sendReq);

/**
 * * POST서버로 요청을 보내는 함수
 */
//promise값을 반환하는 비동기 함수
async function sendReq(){
  let elem = this;
  //http 요청 생성
  await fetch("http://localhost:8080", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    //body에 json 문자열 반환
    body: JSON.stringify({
      id : elem.id,
      value : elem.value
    }),
  })
  .then(res => {
    if(res.status == 200){
      menuOn(true);
    } else{
      menuOn(false);
    }
  })  
  .catch(err => {
    console.error("요청 중 오류 발생:", err);
    menuOn(false);
  });
}

/**
 * * 응답 시 반응 class 추가 삭제
 * @param {boolean} isTurnOn 
 */
function menuOn(isTurnOn){
  for(let menu of menus){
    if(isTurnOn){
      menu.classList.add('menu100');
      menu.classList.remove('menu20');
    }
    else{
      menu.classList.add('menu20');
      menu.classList.remove('menu100');
    }
  }
}
