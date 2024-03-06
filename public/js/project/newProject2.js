function openPopup() {
    document.querySelector('.popup-overlay').style.display = 'block';
    document.querySelector('.popup-content').style.display = 'block';
    console.log('open');
}

function closePopup() {
    console.log('close');
    document.querySelector('.popup-overlay').style.display = 'none';
    document.querySelector('.popup-content').style.display = 'none';
}

// HTML 파일 내에 존재하는 모든 'memberClick' 클래스 요소를 가져옵니다.
// var members = document.querySelectorAll('.memberClick');

// // 각 요소에 대해 클릭 이벤트 리스너를 추가합니다.
// members.forEach((member) => {
//     member.addEventListener('click', function () {
//         // 클릭된 요소에 'clicked' 클래스를 추가합니다.
//         // 이 클래스는 CSS에서 미리 정의해둔 표식(예: 테두리 색상 변경)을 줄 수 있습니다.
//         this.classList.add('clicked');
//     });
// });

// const now = new Date();
// const nowDate = `${now.getFullYear}-${now.getMonth + 1}-${now.getDate}`;

// $(document).ready(function () {
//     $('input[name="nowDateName"]').attr('placeholder', nowDate);
// });

window.onload = function () {
    target = document.getElementById('proImg'); // file 아이디 선언
    target.addEventListener('change', function () {
        // change 함수

        if (target.value.length) {
            // 파일 첨부인 상태일경우 파일명 출력
            $('#origin_name').html(target.files[0].name);
        } else {
            //버튼 클릭후 취소(파일 첨부 없을 경우)할때 파일명값 안보이게
            $('#origin_name').html('');
        }
    });
};

const emailInput = document.getElementById('email-write');
const emailList = document.getElementById('emailList');
const inviteForm = document.getElementById('member-invitation');

function addEmail() {
    const email = emailInput.value.trim();
    if (email) {
        const listItem = document.createElement('li');
        listItem.textContent = email;
        listItem.textContent = email;
        emailList.appendChild(listItem);
        emailInput.value = '';
    }
}

inviteForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const emails = Array.from(emailList.children).map((li) => li.textContent);
    console.log('Inviting:', emails);
});
