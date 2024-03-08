// 프로젝트 규칙, 멤버 조회, project overview 조회
(async function loadProjectInfo() {
    const token = localStorage.getItem("token");

    try {
        const response = await axios({
            method: "POST",
            url: `/api/project/get/info`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        const { success, result } = response.data;
        if (success) {
            document.getElementById("overview-text").textContent = result.overview;
            // document.getElementById("member-main").textContent = result.;
            if (result.rule !== null && result.rule !== "") {
                // const rule = JSON.parse(result.rule);
                const rule = result.rule.split(" ");

                console.log("프로젝트 규칙 : ", rule);
                for (let i = 0; i < rule.length; i++) {
                    let div = document.createElement("div");
                    div.id = `ruleList${i}`;
                    div.innerHTML = `
                    <li class="li" style = "background : white;">
                        <span class="text-element" >${rule[i]}</span>
                        <span class="rule-icon" onclick="deleteProjectRuleFunc(i)">
                        <img src="../../public/img/trash.png" class="rule-img delete-icon" />
                    </span>
                    </li>
                    `;
                    document.getElementById("rule-list").appendChild(div);
                }
            }
        } else {
            console.error("API 요청 실패:", response.data);
        }
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
})();

//파일 정보 조회
(async function () {
    const token = localStorage.getItem("token");
    const getProjectFile = await axios({
        method: "POST",
        url: "/api/project/get/file",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const { success, result } = getProjectFile.data;
    if (success) {
        document.getElementsByClassName("plan-file-contain").textContent = result.plan;
        if (result.plan !== null && result.plan !== "") {
            const plan = JSON.parse(result.plan);
            for (let i = 0; i < plan.length; i++) {
                let div = document.createElement("div");
                div.innerHTML = `
            <div class="plan-file-name">
                <div class="plan-file-img">
                    <img src="../../public/img/file-icon.png" class="file-icon" />
                </div>
                <div>${plan[i]}</div>
            </div>
        `;
                document.getElementsByClassName("plan-file-contain")[0].appendChild(div);
            }
        }
        document.getElementsByClassName("erd-file-contain").textContent = result.erd;
        if (result.erd !== null && result.erd !== "") {
            const erd = JSON.parse(result.erd);
            for (let i = 0; i < erd.length; i++) {
                let div = document.createElement("div");
                div.innerHTML = `
            <div class="erd-file-name">
                <div class="erd-file-img">
                    <img src="../../public/img/file-icon.png" class="file-icon" />
                    </div>
                    <div>${erd[i]}</div>
            </div>
            `;
                document.getElementsByClassName("erd-file-contain")[0].appendChild(div);
            }
        }
        document.getElementsByClassName("api-file-contain").textContent = result.api;
        if (result.api !== null && result.api !== "") {
            const api = JSON.parse(result.api);
            for (let i = 0; i < api.length; i++) {
                let div = document.createElement("div");
                div.innerHTML = `
            <div class="api-file-name">
                <div class="api-file-img">
                    <img src="../../public/img/file-icon.png" class="file-icon" />
                    </div>
                    <div>${api[i]}</div>
            </div>
            `;
                document.getElementsByClassName("api-file-contain")[0].appendChild(div);
            }
        }
    }
})();

//이슈 노트 가져오기
(async function () {
    const token = localStorage.getItem("token");
    try {
        const response = await axios({
            method: "GET",
            url: "/api/project/issue",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { success, result } = response.data;
        if (success) {
            for (let i = 0; i < result.length; i++) {
                let tr = document.createElement("tr");
                tr.innerHTML = `
                        <td class="td1">${i + 1}</td>
                        <a href="/project/issue_content/${result[i].id}> <td class="td2" style = "text-decoration: none;
                        color: black; cursor: pointer;">${result[i].title}</td></a>
                        <td class="td3">${result[i].userId}</td>
                        <td class="td4">${result[i].issue_date}</td>
                `;
                document.getElementById("issueTbody").appendChild(tr);
            }
        } else {
            console.error("API 요청 실패:", response.data);
        }
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
})();

//팀 활동, 피드백 요청 목록
(async function () {
    const token = localStorage.getItem("token");
    try {
        const response = await axios({
            method: "post",
            url: "/api/project/get/log",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const { result, success } = response.data;
        let organizedTeamLog = result.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) return 1;
            if (a.updatedAt < b.updatedAt) return -1;
            return 0;
        });

        if (success) {
            for (let i = 0; i < organizedTeamLog.length; i++) {
                console.log(organizedTeamLog);
                // `${changeStatusKor(organizedTeamLog[i].boardStatus)}`가 '피드백 요청'이 아닌 경우에만 div를 생성하고 추가합니다.
                if (changeStatusKor(organizedTeamLog[i].boardStatus) !== "피드백 요청") {
                    let div = document.createElement("div");
                    div.classList.add("teamDiv");
                    div.innerHTML = `
                                ${organizedTeamLog[i].user_img}
                                <div id="team-work-list-text">${organizedTeamLog[i].user_name}님이 ${
                        organizedTeamLog[i].title
                    }을 ${changeStatusKor(organizedTeamLog[i].boardStatus)}으로 변경하였습니다.</div>
                                `;
                    document.getElementsByClassName("team-work-list")[0].appendChild(div);
                }

                if (organizedTeamLog[i].boardStatus === "needFeedback") {
                    let div = document.createElement("div");
                    div.classList.add("needFeedDiv");
                    div.innerHTML = `
                    
                    ${organizedTeamLog[i].user_img}
                    <a href="/project/issue_content/${result[i].id}><div id="feedback-list-text">${
                        organizedTeamLog[i].user_name
                    }님이 ${organizedTeamLog[i].title}을 ${changeStatusKor(
                        organizedTeamLog[i].boardStatus
                    )}으로 변경하였습니다.</div></a>
                        `;
                    document.getElementsByClassName("feedback-list")[0].appendChild(div);
                    if (organizedTeamLog.length.length === 5) {
                        break;
                    }
                }
            }
        } else {
            console.error("팀 활동 요청 실패 : ", response.data);
        }
    } catch (error) {
        console.error("팀 활동 요청 중 오류 발생 : ", error);
    }
})();
function changeStatusKor(selectedProjectStatus) {
    let statusKor = "";
    switch (selectedProjectStatus) {
        case "planning":
            statusKor = "계획 중";
            break;
        case "progress":
            statusKor = "진행 중";
            break;
        case "needFeedback":
            statusKor = "피드백 요청";
            break;
        case "finishFeedback":
            statusKor = "피드백 완료";
            break;
        case "suspend":
            statusKor = "중단됨";
            break;
        case "finish":
            statusKor = "완료";
            break;
    }
    return statusKor;
}

//프로젝트 규칙 생성
async function projectRuleGeneration() {
    const list = document.getElementById("rule-list");
    const li = document.createElement("li");
    li.className = "li";

    const textElement = document.createElement("span");
    textElement.className = "text-element";
    textElement.style.display = "none";

    const input = document.createElement("input");
    input.type = "text";

    const ruleIcon = document.createElement("span");
    ruleIcon.className = "rule-icon";

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "../../public/img/trash.png";
    deleteIcon.className = "rule-img delete-icon";

    ruleIcon.appendChild(deleteIcon);

    li.appendChild(input);
    li.appendChild(textElement);
    li.appendChild(ruleIcon);
    list.appendChild(li);
    input.focus();

    input.onkeydown = async function (event) {
        if (event.key !== "Enter") return;
        const rule = input.value;
        const token = localStorage.getItem("token");
        try {
            const response = await axios({
                method: "PATCH",
                url: "/api/project/update/rule",
                data: {
                    rule,
                },
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            const { success, result } = response.data;
            if (success) {
                console.log("규칙 추가 성공 : ", result);
                location.reload(true);
            } else {
                console.log("규칙 추가 실패");
            }
        } catch (error) {
            console.log("규칙 추가 중 에러 발생 : ", error);
        }
    };
}
//규칙 삭제
async function deleteProjectRuleFunc(i) {
    const divTag = document.querySelector(`#ruleList${[i]}`);
    divTag.remove();
    const rule = document.querySelector("#rule-list");
    console.log(divTag);
    const token = localStorage.getItem("token");
    try {
        const response = await axios({
            method: "PATCH",
            url: "/api/project/update/rule",
            data: {
                rule,
            },
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        const { success, result } = response.data;
        if (success) {
            console.log("규칙 추가 성공 : ", result);
            // location.reload(true);
        } else {
            console.log("규칙 추가 실패");
        }
    } catch (error) {
        console.log("규칙 추가 중 에러 발생 : ", error);
    }
}

//파일 업로드
async function uploadPlan() {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];
    const token = localStorage.getItem("token");

    if (!file) {
        alert("파일을 선택해주세요");
        console.log("파일을 선택해주세요.");
        return;
    }
    console.log(file);
    const formData = new FormData();
    formData.append("project_files", file);
    const type = "plan";
    formData.append("type", type);
    const response = await axios({
        method: "PATCH",
        url: "/api/project/update/file",
        data: formData,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    const { result, success } = response.data;
    if (success) {
        let div = document.createElement("div");
        div.innerHTML = `
                <div class="plan-file-name">
                    <div class="plan-file-img">
                        <img src="../../public/img/file-icon.png" class="file-icon" />
                    </div>
                    <div>${file.name}</div>
                </div>
            `;
        document.getElementsByClassName("plan-file-contain")[0].appendChild(div);
    } else {
        console.log("파일 업로드에 실패하였습니다.");
    }
}
//파일 업로드(ERD)
async function uploadERD() {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];
    const token = localStorage.getItem("token");

    if (!file) {
        alert("파일을 선택해주세요");
        console.log("파일을 선택해주세요.");
        return;
    }

    const formData = new FormData();
    formData.append("project_files", file);
    const type = "erd";
    formData.append("type", type);
    const response = await axios({
        method: "PATCH",
        url: "/api/project/update/file",
        data: formData,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    const { result, success } = response.data;
    console.log(response);
    if (success) {
        let div = document.createElement("div");
        div.innerHTML = `
                <div class="erd-file-name">
                    <div class="erd-file-img">
                        <img src="../../public/img/file-icon.png" class="file-icon" />
                    </div>
                    <div>${file.name}</div>
                </div>
            `;
        document.getElementsByClassName("erd-file-contain")[0].appendChild(div);
    } else {
        console.log("파일 업로드에 실패하였습니다.");
    }
}
//파일 업로드(API)
async function uploadAPI() {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];
    const token = localStorage.getItem("token");

    if (!file) {
        alert("파일을 선택해주세요");
        console.log("파일을 선택해주세요.");
        return;
    }

    const formData = new FormData();
    formData.append("project_files", file);
    const type = "api";
    formData.append("type", type);
    const response = await axios({
        method: "PATCH",
        url: "/api/project/update/file",
        data: formData,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    const { result, success } = response.data;
    if (success) {
        let div = document.createElement("div");
        div.innerHTML = `
                <div class="api-file-name">
                    <div class="api-file-img">
                        <img src="../../public/img/file-icon.png" class="file-icon" />
                    </div>
                    <div>${file.name}</div>
                </div>
            `;
        document.getElementsByClassName("api-file-contain")[0].appendChild(div);
    } else {
        console.log("파일 업로드에 실패하였습니다.");
    }
}

//멤버 추가
async function addMember() {
    let newMemberId = prompt("회원님의 아이디를 입력해주세요:");
    if (!newMemberId) {
        return;
    }

    let member_id = [newMemberId];
    console.log(member_id);
    const token = localStorage.getItem("token");
    try {
        const response = await axios({
            method: "POST",
            url: "/api/project/add/member",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                member_id,
            },
        });
        console.log("post", response);
        const { result, success } = response.data;
        if (success) {
            let div = document.createElement("div");
            div.innerHTML = `
                    <div id="pro-img-div"><img src="../../public/img/mypage.png" id="pen-img" /></div>
                    ${result.member_id}`;
            document.getElementById("member-main").appendChild(div);
            console.log(result);
            console.log("멤버 추가 성공 : ", result);
        }
    } catch (error) {
        console.error("멤버 추가 도중에 오류가 발생하였습니다. ", error);
    }
}

//멤버 강퇴

//project overview 수정
let projectId = localStorage.getItem("project_id");
async function changeOverview(e) {
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    input.style.display = "inline";
    input.value = text.textContent;
    text.style.display = "none";
    input.focus();
    const token = localStorage.getItem("token");
}

async function saveOverview(event) {
    if (event.key !== "Enter") return;
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    text.textContent = input.value;
    text.style.display = "inline";
    input.style.display = "none";
    const token = localStorage.getItem("token");

    try {
        const response = await axios({
            method: "PATCH",
            url: "/api/project/update/overview",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                overview: input.value,
            },
        });
        const { success, result } = response.data;
        if (success) {
            console.log("Overview 업데이트에 성공하셨습니다. :", result);
        } else {
            console.error("overview 업데이트에 실패하셨습니다.");
        }
    } catch (error) {
        console.error("overview 업데이트 도중 오류가 발생하였습니다. :", error);
    }
}
async function saveBlurOverview(event) {
    const text = document.getElementById("overview-text");
    const input = document.getElementById("overview-input");
    text.textContent = input.value;
    text.style.display = "inline";
    input.style.display = "none";

    const token = localStorage.getItem("token");

    const project_id = 10;

    try {
        const response = await axios({
            method: "PATCH",
            url: "/api/project/update/overview",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                project_id,
                overview: input.value,
            },
        });
        const { success, result } = response.data;
        if (success) {
            console.log("Overview 업데이트에 성공하셨습니다. :", result);
        } else {
            console.error("overview 업데이트에 실패하셨습니다.");
        }
    } catch (error) {
        console.error("overview 업데이트 도중 오류가 발생하였습니다. :", error);
    }
}
