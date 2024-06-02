const ul = document.getElementsByTagName('ul');

for(let i = 0; i < ul.length; i++){
ul[i].addEventListener('click', () => {
  confirm("삭제하시겠습니까?");
  if (del) {
    sendReq();
  }
})
}

//delete method는 body가 필요 없음
async function sendReq(id) {
  await fetch(`http://localhost:8080/delete/${id}`), {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
  }
    .then(res => {
      if (res.status == 200) {
        alert("삭제되었습니다.")
      } else {
        alert("삭제실패")
      }
    })
    .catch(err => {
      console.error("요청 중 오류 발생:", err);
    });
}