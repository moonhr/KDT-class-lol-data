const ul = document.getElementsByTagName('ul');
const li = document.getElementsByTagName('li');
const dataListAdd = document.getElementById("data-list-add");

/**
 * * 태그 클릭시 이벤트 실행
 */
for (let i = 0; i < ul.length; i++) {
  ul[i].addEventListener('click', (e) => {
    if (confirm("삭제하시겠습니까?")) {
      //첫번째 li를 담아줄 변수 id 선언
      let id;
      //이벤트타겟 태그가 ul이라면
      if(e.target.tagName === "UL"){
        id = e.target.children[0].innerHTML
        console.log("ul찍힘"+id)
        e.target.remove();
      } 
      //이벤트타겟 태그가 li라면
      else if (e.target.tagName === "LI") {
        id = e.target.parentNode.children[0].innerHTML
        console.log("li찍힘"+id)
        e.target.parentNode.remove();
      }
      sendReq(id);
    } else {
      alert("취소됨");
    }
  })
}

//delete method는 body가 필요 없음
//삭제 요청 보내는 함수 id를 인수로 받는 비동기함수
/**
 * * DELETE 서버로 요청을 보내고 받은 응답으로 함수를 실행
 * @param {Event.target} id 
 */
async function sendReq(id) {
  try {
    // fetch API를 사용하여 서버에 DELETE 요청을 보냄
    const res = await fetch(`http://localhost:8080/delete/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
    })
    // 서버 응답의 상태 코드를 확인
    if (res.status == 200) {
      alert("삭제되었습니다.")
    } else {
      alert("삭제실패")
    }
  } catch (err) {
    console.error("요청 중 오류 발생:", err);
  };
}
