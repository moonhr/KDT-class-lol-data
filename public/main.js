


const  nameMenu = document.getElementById('name.menu')
const  lineMenu = document.getElementById('line.menu')
const  championMenu = document.getElementById('champion.menu')

nameMenu.addEventListener('input',sendReq)
lineMenu.addEventListener('input',sendReq)
championMenu.addEventListener('input',sendReq)

/**
 * * POST서버로 요청을 보내는 함수
 */
//promise값을 반환하는 비동기 함수
async function sendReq(){
  let elem = this;
  //http 요청 생성
  await fetch("http://localhost:8080", {
    method: "POST",
    //body에 json 문자열 반환
    body: JSON.stringify({
      id : elem.id,
      value : elem.value
    }),
  })
  .then(res => {
    if(res.status == 200){
      menuOn(elem.id, true);
    } else{
      menuOn(elem.id, false);
    }
  })  
}

function menuOn(){

}