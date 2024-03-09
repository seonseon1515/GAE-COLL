$(function () {
    $("#start_date").datepicker({
        lang: "ko",
        dateFormat: "yy-mm-dd",
        monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], //달력의 월 부분 텍스트
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], //달력의 월 부분 Tooltip
        dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"], //달력의 요일 텍스트
        dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], //달력의 요일 Tooltip
    });
    $("#end_date").datepicker({
        lang: "ko",
        dateFormat: "yy-mm-dd",
        monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], //달력의 월 부분 텍스트
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], //달력의 월 부분 Tooltip
        dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"], //달력의 요일 텍스트
        dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], //달력의 요일 Tooltip
    });
});

function openPopup() {
    document.querySelector(".popup-overlay").style.display = "block";
    document.querySelector(".popup-content").style.display = "block";
    console.log("open");
}

function closePopup() {
    console.log("close");
    document.querySelector(".popup-overlay").style.display = "none";
    document.querySelector(".popup-content").style.display = "none";
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
    target = document.getElementById("proImg"); // file 아이디 선언
    target.addEventListener("change", function () {
        // change 함수

        if (target.value.length) {
            // 파일 첨부인 상태일경우 파일명 출력
            $("#origin_name").html(target.files[0].name);
        } else {
            //버튼 클릭후 취소(파일 첨부 없을 경우)할때 파일명값 안보이게
            $("#origin_name").html("");
        }
    });
};

const emailInput = document.getElementById("email-write");
const emailList = document.getElementById("emailList");
const inviteForm = document.getElementById("member-invitation");
const emailList2 = document.getElementById("emailList2");

async function createProject() {
    const projectName = document.querySelector("#projectName").value;
    const projectDateStart = document.querySelector("#start_date").value;
    const projectDateEnd = document.querySelector("#end_date").value;
    const projectImg = document.querySelector("#proImg");
    const projectOverview = document.querySelector("#proIntro").value;

    const token = localStorage.getItem("token");

    let imgSelected = false;

    if (projectName === "") {
        alert("프로젝트 이름을 작성해주세요.");
        return;
    }
    if (projectDateStart === "") {
        alert("프로젝트 시작 날짜를 입력해주세요.");
        return;
    }
    if (projectDateEnd === "") {
        alert("프로젝트 마감 날짜를 입력해주세요.");
        return;
    }

    if (projectImg.files[0] === undefined) {
        alert("프로젝트 이미지를 첨부해주세요.");
        return;
    }

    if (projectOverview === "") {
        alert("프로젝트 소개글을 작성해주세요.");
        return;
    }

    const formData = new FormData();
    if (projectImg.files[0] !== undefined) {
        imgSelected = true;
        formData.append("project_img", projectImg.files[0]);
    }

    formData.append("project_name", projectName);
    formData.append("start_date", projectDateStart);
    formData.append("end_date", projectDateEnd);
    formData.append("member_id", inviteUser);
    // 임의로 넣어준 값
    formData.append("send_img", imgSelected);
    formData.append("overview", projectOverview);

    const careateProjectResponse = await axios({
        method: "post",
        url: "/api/project/create",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    });
    console.log(careateProjectResponse);

    const { success, result, token: newToken } = careateProjectResponse.data;

    if (success) {
        localStorage.setItem("token", newToken);
        document.location.href = `/project/home`;
    } else {
        alert("프로젝트 생성에 실패하였습니다.");
    }
}

// 1. axios를 쓰기 전에 값을 가져온다
const inviteUser = [];
async function addEmail() {
    const projectEmail = document.getElementById("email-write").value;

    let isSignup = false;

    const emailInviteRespond = await axios({
        method: "post",
        url: "/api/user/find",
        data: {
            email: projectEmail,
            isSignup,
        },
    });
    console.log(emailInviteRespond);
    console.log("projectEmail: ", projectEmail);
    const { success, result } = emailInviteRespond.data;

    if (success) {
        inviteUser.push(result.id);
        const listItem = document.createElement("li");
        listItem.classList.add("liEmail");
        listItem.textContent = projectEmail;
        emailList.appendChild(listItem);
        emailList2.appendChild(listItem);
        emailInput.value = "";
    } else {
        alert("등록되지 않은 사용자 입니다.");
    }
}

// const projectEmail = document.querySelectorAll(".liEmail").value;
// console.log("projectEmail", projectEmail);
