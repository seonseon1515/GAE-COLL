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
// label.addEventListener("click", () => {
//     if (label.parentNode.classList.contains("active")) {
//         label.parentNode.classList.remove("active");
//     } else {
//         label.parentNode.classList.add("activxe");
//     }
// });
const token = localStorage.getItem("token");
const ids = document.location.href.split("project/board_content/");
const board_id = ids[1];
// 불러오기
(async function () {
    try {
        const getBoardDetail = await axios({
            method: "get",
            url: `/api/project/board/${board_id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        //deadline, userId, projectId, status, title, description

        const { deadline, userId, projectId, status, title, description } = getBoardDetail.data.result.data;
        console.log(deadline, userId, projectId, status, title, "설명", description);

        const getProjectName = await axios({
            method: "POST",
            url: "/api/project/get/info",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { project_name, member } = getProjectName.data.result;

        const getUserName = await axios({
            method: "POST",
            url: "/api/user/findInfo",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                userId,
            },
        });

        console.log(getUserName.data.result.user_name);
        const { user_name } = getUserName.data.result;
        const deadLine = new Date(deadline);
        const year = deadLine.getFullYear();
        const month = (deadLine.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1 해줌
        const day = deadLine.getDate().toString().padStart(2, "0"); // 일
        const formattedDate = `${year}-${month}-${day}`;
        document.getElementById("boardDeadline").value = formattedDate;
        document.getElementById("boardManager").textContent = user_name;
        document.getElementById("myProject").textContent = project_name;
        document.getElementById("writeExplain").value = description;

        const circle = document.querySelector("#blue");
        const statusEl = document.getElementById("pro_status");
        const bg = document.getElementById("bg");
        if (status === "planning") {
            statusEl.textContent = "";
            statusEl.textContent = "계획중";
            bg.style.backgroundColor = "hsl(199, 74%, 85%)";
            circle.style.backgroundColor = "hsl(198, 60%, 70%)";
        } else if (status === "needFeedback") {
            statusEl.textContent = "";
            statusEl.textContent = "피드백 요청";
            bg.style.backgroundColor = "#f8cfcf";
            circle.style.backgroundColor = "#f25c5c";
        } else if (status === "finishFeedback") {
            statusEl.textContent = "";
            statusEl.textContent = "피드백 완료";
            bg.style.backgroundColor = "#d1d0d0";
            circle.style.backgroundColor = "#504e4e";
        } else if (status === "suspend") {
            statusEl.textContent = "";
            statusEl.textContent = "중단";
            bg.style.backgroundColor = "#f8d6f8";
            circle.style.backgroundColor = "purple";
        } else if (status === "finish") {
            statusEl.textContent = "";
            statusEl.textContent = "피드백 완료";
            bg.style.backgroundColor = "#d1d0d0";
            circle.style.backgroundColor = "#504e4e";
        } else if (status === "progress") {
            statusEl.textContent = "";
            statusEl.textContent = "진행중";
            bg.style.backgroundColor = "#f9f9c1";
            circle.style.backgroundColor = "#eaea5e";
        } else {
            statusEl.textContent = "";
            console.log("작업상태 없음");
        }
    } catch (error) {
        console.log("error", error);
    }

    // document.getElementById("pro_status").textContent = status;
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
