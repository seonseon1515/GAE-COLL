const token = localStorage.getItem("token");

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
//         label.parentNode.classList.add("active");
//     }
// });

// 사용자 이름 조회
// (function () {
//     axios({
//         method: "POST",
//         url: "/api/user/info",
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     }).then((res) => {
//         console.log("res data결과", res.data);
//         const { user_name, id } = res.data.result;
//         document.querySelector(".userId").value = id;
//         document.querySelector(".writer_box").innerHTML = user_name;
//         document.getElementById("issue_date").value = new Date().toISOString().slice(0, 10);
//     });
// })();

//프로젝트명 불러오기
(function () {
    axios({
        method: "POST",
        url: "/api/project/get/info",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        console.log("res data결과", res.data);
        const { project_name, member } = res.data.result;
        const statusBox = document.getElementById("statusBG");
        const myProjectBox = document.getElementById("myProject");
        const boardManager = document.getElementById("boardManager");

        for (let i = 0; i < member.length; i++) {
            console.log(member[i].user_name);
            const optionEl = document.createElement("option");
            // const memberID = document.createElement("input");
            optionEl.value = member[i].user_name;
            optionEl.textContent = member[i].user_name;
            optionEl.className = `${member[i].id}`;
            // memberID.classList.add(`${member[i].id}`);
            // memberID.value = member[i].id;
            // memberID.style.display = "none";
            boardManager.appendChild(optionEl);
            // boardManager.appendChild(memberID);
        }

        myProjectBox.textContent = "";
        myProjectBox.textContent = project_name;
    });
})();

//보드 작성
async function submitFunc() {
    try {
        //작업 제목
        const title = document.getElementById("boardTitle").value;
        //작업 설명
        const description = document.getElementById("writeExplain").value;
        //상태
        const status = document.getElementById("boardStatus").value;
        //마감일
        const deadline = document.getElementById("boardDeadline").value;
        console.log(deadline, status, description, title);
        // //프로젝트 멤버id = 담당자 id (class이름에 저장)
        const boardManager = document.getElementById("boardManager");
        const selectedOption = boardManager.options[boardManager.selectedIndex];
        const member_id = selectedOption.className;

        if (title === "" || title === undefined || title === null) {
            alert("제목을 작성해주세요.");
            return;
        }
        if (description === "" || description === undefined || description === null) {
            alert("설명을 작성해주세요.");
            return;
        }
        if (status === "" || status === undefined || status === null) {
            alert("작업 상태를 선택해주세요.");
            return;
        }
        if (member_id === "" || member_id === undefined || member_id === null) {
            alert("담당자를 선택해주세요");
            return;
        }
        if (deadline === "" || deadline === undefined || deadline === null) {
            alert("마감일을 설정해주세요.");
            return;
        }
        console.log("담당자 id", member_id);

        const res = await axios({
            method: "POST",
            url: "/api/project/board/write",
            data: {
                title,
                description,
                status,
                deadline,
                member_id,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.data.success) {
            alert("새로운 일정이 추가되었습니다.");
            document.location.href = "board_main";
        }
    } catch (error) {
        console.error(error);
    }
}
