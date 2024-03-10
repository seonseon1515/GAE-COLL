/* 화살표 함수 */
const label = document.querySelector(".status_modify");
const options = document.querySelectorAll(".optionItem");

// 클릭한 옵션의 텍스트를 라벨 안에 넣음
const handleSelect = (item) => {
    label.parentNode.classList.remove("active");
    label.innerHTML = item.textContent;
};
// 옵션 클릭시 클릭한 옵션을 넘김
options.forEach((option) => {
    option.addEventListener("click", () => handleSelect(option));
});

// 라벨을 클릭시 옵션 목록이 열림/닫힘
label.addEventListener("click", () => {
    if (label.parentNode.classList.contains("active")) {
        label.parentNode.classList.remove("active");
    } else {
        label.parentNode.classList.add("activxe");
    }
});

// 불러오기
(async function () {
    const status = document.getElementById("pro_status").textContent;
})();

//보내기
async function editFunc() {
    const statusKor = document.getElementById("pro_status").textContent;
    let status = "";
    if (statusKor === "계획중") {
        status = "planning";
    } else if (statusKor === "피드백 요청") {
        status = "needFeedback";
    } else if (statusKor === "피드백 완료") {
        status = "finishFeedback";
    } else if (statusKor === "중단") {
        status = "suspend";
    } else if (statusKor === "완료") {
        status = "finish";
    } else {
        return console.log("status값 없음");
    }
}

//작업상태 변경
async function changeStatusToPlan() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");

    status.textContent = "";
    status.textContent = "계획중";
    bg.style.backgroundColor = "hsl(199, 74%, 85%)";
    circle.style.backgroundColor = "hsl(198, 60%, 70%)";
}
async function changeStatusToProg() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");

    status.textContent = "";
    status.textContent = "진행중";
    bg.style.backgroundColor = "#f9f9c1";
    circle.style.backgroundColor = "#eaea5e";
}
async function changeStatusToSus() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");

    status.textContent = "";
    status.textContent = "중단";
    bg.style.backgroundColor = "#f8d6f8";
    circle.style.backgroundColor = "purple";
}
async function changeStatusToFin() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");
    status.textContent = "";
    status.textContent = "완료";
    bg.style.backgroundColor = "#d2f5d2";
    circle.style.backgroundColor = "#328d32";
}
async function changeStatusToNeedFeed() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");
    status.textContent = "";
    status.textContent = "피드백 완료";
    bg.style.backgroundColor = "#d1d0d0";
    circle.style.backgroundColor = "#504e4e";
}
async function changeStatusToNeedFeed() {
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");
    status.textContent = "";
    status.textContent = "피드백 요청";
    bg.style.backgroundColor = "#f8cfcf";
    circle.style.backgroundColor = "#f25c5c";
}
