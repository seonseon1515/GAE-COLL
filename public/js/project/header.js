// let pro_deadline = ``;

// function deadlineCalc() {
//     const projectStartDate = document.querySelector("#projectStartDate").value;
//     const projectEndDate = document.querySelector("#projectEndDate").value;

//     console.log(projectStartDate);

//     // if (projectStartDate == !null && projectEndDate == !null) {
//     //     `${diff(projectStartDate, "days")}`;

//     //     document.querySelector(".pro_deadline").innerHTML = pro_deadline;
//     // }
// }

// projectStartDate.setAttribute("dateType2", "YYYY-MM-dd");

// const projectStartDate = document.querySelector("#projectStartDate").value;

// 서버에서 가져와서 시행하는 것은 즉시실행 함수?
// 함수에서 굳이 직접 넣어 실행할 필요 없음

(async function () {
    const token = localStorage.getItem("token");

    const getProjectInfoResult = await axios({
        method: "post",
        url: "/api/project/get/info",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log("getProjectDate.data", getProjectInfoResult.data);
    const { success, result } = getProjectInfoResult.data;

    document.querySelector("#projectStartDate").textContent = `${result.start_date}`;
    document.querySelector("#projectEndDate").textContent = `${result.end_date}`;
    document.querySelector(".github_link").href = result.github;
    document.querySelector(".pro_name").textContent = `${result.project_name}`;
    document.querySelector(".pro_status").textContent = `${result.status}`;

    const getDateDiff = (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);

        const diffDate = date1.getTime() - date2.getTime();

        return Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
    };

    let deadlineCalc = getDateDiff(`${result.start_date}`, `${result.end_date}`);
    document.querySelector(".pro_deadline").textContent = `D-${deadlineCalc}`;
})();

// 날짜 수정하고 그대로 계산, 그 값을 계속 유지하게 하는 함수
// 시작일, 마감일 수정할 수 있게 하는 버튼


// 깃허브 링크 추가하는 기능 추가
function addLink(){
  document.getElementById("popup").style.display = "block";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
  console.log("close");
}
// 로딩될 때 값 불러오기
