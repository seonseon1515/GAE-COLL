function openPopup() {
    document.querySelector('.popup-overlay').style.display = 'block';
    document.querySelector('.popup-content').style.display = 'block';
}

function closePopup() {
    document.querySelector('.popup-overlay').style.display = 'none';
    document.querySelector('.popup-content').style.display = 'none';
}

// HTML 파일 내에 존재하는 모든 'memberClick' 클래스 요소를 가져옵니다.
var members = document.querySelectorAll('.memberClick');

// 각 요소에 대해 클릭 이벤트 리스너를 추가합니다.
members.forEach((member) => {
    member.addEventListener('click', function () {
        // 클릭된 요소에 'clicked' 클래스를 추가합니다.
        // 이 클래스는 CSS에서 미리 정의해둔 표식(예: 테두리 색상 변경)을 줄 수 있습니다.
        this.classList.add('clicked');
    });
});
