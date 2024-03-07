/* 화살표 함수 */
const label = document.querySelectorAll('.placement_status1');
const options = document.querySelectorAll('.option_item');

// 클릭한 옵션의 텍스트를 라벨 안에 넣음
const handleSelect = (item) => {
    label.parentNode.classList.remove('active');
    label.innerHTML = item.textContent;
};
// 옵션 클릭시 클릭한 옵션을 넘김
options.forEach((option) => {
    option.addEventListener('click', () => handleSelect(option));
});

// 라벨을 클릭시 옵션 목록이 열림/닫힘
label.addEventListener('click', () => {
    if (label.parentNode.classList.contains('active')) {
        label.parentNode.classList.remove('active');
    } else {
        label.parentNode.classList.add('active');
    }
});

// 작업 추가 버튼 누를 시 계획 중에 행 추가되는 함수
const addWork = document.querySelector('.add');
const addTable = document.getElementById('planning_table');
const newRow = addTable.insertRow();
const addTd = document.getElementById('');

// addWork.addEventListener('click', () => {
   
// }

//     // cell1.innerHTML = '<input type="text" class="td1" id="td1" placeholder="작업 이름 입력">';
//     // cell2.innerHTML = '<td id="td2" class="td2">';
//     // cell3.innerHTML = '<input type="date" class="td3" id="td3" placeholder="마감일 선택">';
//     // cell4.innerHTML = '<td id="td4" class="td4">';
// });

