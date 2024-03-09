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
        label.parentNode.classList.add("active");
    }
});

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

//보드 작성
async function submitFunc() {
    try {
        const boardManager = document.getElementById("board_manager").textContent;
        const issue_date = document.querySelector(".issueDate").value;
        const title = document.querySelector(".title_box").textContent;
        const userId = document.querySelector(".userId").value;

        // console.log("files", fileInput.files[0]);
        // console.log("formData", formData);

        const res = await axios({
            method: "POST",
            url: "/api/project/board/get",
            data: {},
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log(res);
        document.location.href = "issue_main";
    } catch (error) {
        console.error(error);
    }
}
