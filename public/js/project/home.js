// // 프로젝트 규칙, 멤버 조회, project overview 조회
// (async function loadProjectInfo() {
//     const token = localStorage.getItem("token");

//     try {
//         const response = await axios({
//             method: "POST",
//             url: `/api/project/get/info`,
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         console.log(response);
//         const { success, result } = response.data;
//         if (success) {
//             document.getElementById("overview-text").textContent = result.overview;
//             // /document.getElementById("member-main").textContent =;
//             if (result.rule !== null && result.rule !== "") {
//                 const rule = JSON.parse(result.rule);
//                 console.log("프로젝트 규칙 : ", result.rule);
//                 for (let i = 0; i < rule.length; i++) {
//                     let html = document.createElement("html");
//                     html.innerHTML = `
//                     <li class="li" style = "background : white;">
//                         <span class="text-element">${rule[i]}</span>
//                         <span class="rule-icon">
//                         <img src="../../public/img/trash.png" class="rule-img delete-icon" onclick="deleteProjectRule()"/>
//                     </span>
//                     </li>
//                     `;
//                     document.getElementById("rule-list").appendChild(html);
//                 }
//             }
//         } else {
//             console.error("API 요청 실패:", response.data);
//         }
//     } catch (error) {
//         console.error("API 요청 중 오류 발생:", error);
//     }
// })();

// //파일 정보 조회
// (async function () {
//     const token = localStorage.getItem("token");
//     const getProjectFile = await axios({
//         method: "POST",
//         url: "/api/project/get/file",
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     console.log(getProjectFile);
//     const { success, result } = getProjectFile.data;
//     console.log(result);
//     if (success) {
//         document.getElementsByClassName("plan-file-contain").textContent = result.plan;
//         if (result.plan !== null && result.plan !== "") {
//             const plan = JSON.parse(result.plan);
//             console.log("프로젝트 계획 : ", result.plan);
//             for (let i = 0; i < plan.length; i++) {
//                 let div = document.createElement("div");
//                 div.innerHTML = `
//             <div class="plan-file-name">
//                 <div class="plan-file-img">
//                     <img src="../../public/img/file-icon.png" class="file-icon" />
//                 </div>
//                 <div>${plan[i]}</div>
//             </div>
//         `;
//                 document.getElementsByClassName("plan-file-contain")[0].appendChild(div);
//             }
//         }
//         document.getElementsByClassName("erd-file-contain").textContent = result.erd;
//         if (result.erd !== null && result.erd !== "") {
//             const erd = JSON.parse(result.erd);
//             console.log("프로젝트 erd : ", result.erd);
//             for (let i = 0; i < erd.length; i++) {
//                 let div = document.createElement("div");
//                 div.innerHTML = `
//             <div class="erd-file-name">
//                 <div class="erd-file-img">
//                     <img src="../../public/img/file-icon.png" class="file-icon" />
//                     </div>
//                     <div>${erd[i]}</div>
//             </div>
//             `;
//                 document.getElementsByClassName("erd-file-contain")[0].appendChild(div);
//             }
//         }
//         document.getElementsByClassName("api-file-contain").textContent = result.api;
//         if (result.api !== null && result.api !== "") {
//             const api = JSON.parse(result.api);
//             console.log("프로젝트 api : ", result.api);
//             for (let i = 0; i < api.length; i++) {
//                 let div = document.createElement("div");
//                 div.innerHTML = `
//             <div class="api-file-name">
//                 <div class="api-file-img">
//                     <img src="../../public/img/file-icon.png" class="file-icon" />
//                     </div>
//                     <div>${api[i]}</div>
//             </div>
//             `;
//                 document.getElementsByClassName("api-file-contain")[0].appendChild(div);
//             }
//         }
//     }
// })();

//이슈 노트 가져오기
// (async function () {
//     const token = localStorage.getItem("token");
//     try {
//         const response = await axios({
//             method: "GET",
//             url: "/api/project/issue",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         console.log(response);
//         const { success, result } = response.data;
//         console.log(result);
//         if (success) {
//             for (let i = 0; i < result.length; i++) {
//                 let tr = document.createElement("tr");
//                 tr.innerHTML = `
//                         <td class="td1">${i + 1}</td>
//                         <a href="/project/issue_content/${result[i].id}> <td class="td2">${result[i].title}</td></a>
//                         <td class="td3">${result[i].userId}</td>
//                         <td class="td4">${result[i].issue_date}</td>
//                 `;
//                 document.getElementById("issueTbody").appendChild(tr);
//             }
//         } else {
//             console.error("API 요청 실패:", response.data);
//         }
//     } catch (error) {
//         console.error("API 요청 중 오류 발생:", error);
//     }
// })();

// //프로젝트 규칙 생성
// async function projectRuleGeneration() {
//     const list = document.getElementById("rule-list");
//     const li = document.createElement("li");
//     li.className = "li";

//     const textElement = document.createElement("span");
//     textElement.className = "text-element";
//     textElement.style.display = "none";

//     const input = document.createElement("input");
//     input.type = "text";

//     const ruleIcon = document.createElement("span");
//     ruleIcon.className = "rule-icon";

//     const deleteIcon = document.createElement("img");
//     deleteIcon.src = "../../public/img/trash.png";
//     deleteIcon.className = "rule-img delete-icon";

//     ruleIcon.appendChild(deleteIcon);

//     li.appendChild(input);
//     li.appendChild(textElement);
//     li.appendChild(ruleIcon);
//     list.appendChild(li);
//     input.focus();

//     input.onkeydown = async function (event) {
//         if (event.key !== "Enter") return;

//         const rule = input.value;
//         console.log("rule", rule);
//         const token = localStorage.getItem("token");

//         try {
//             const response = await axios({
//                 method: "PATCH",
//                 url: "/api/project/update/rule",
//                 data: {
//                     rule,
//                 },
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             console.log(response);
//             const { success, result } = response.data;
//             if (success) {
//                 console.log("규칙 추가 성공 : ", result);
//                 location.reload(true);
//             } else {
//                 console.log("규칙 추가 실패");
//             }
//         } catch (error) {
//             console.log("규칙 추가 중 에러 발생 : ", error);
//         }
//     };
// }
// async function deleteProjectRule() {
//     const deleteIcon = document.createElement("img");
//     deleteIcon.src = "../../public/img/trash.png";
//     deleteIcon.className = "rule-img delete-icon";
// }

//팀 활동 (보드 수정)
(async function () {
    const token = localStorage.getItem("token");
    const project_id = localStorage.getItem("project_id");
    try {
        const response = await axios({
            method: "GET",
            url: "/api/project/board/get",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                project_id,
            },
        });
        const { result, success } = response.data;
        if (success) {
            if (result.data !== null && result.data !== "") {
                for (let i = 0; i < result.length; i++) {
                    const userId = result[i].userId;
                    const email = localStorage.getItem("email");

                    const responseUser = await axios({
                        method: "POST",
                        url: "/api/user/find",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        data: {
                            userId,
                            email,
                        },
                    });
                    console.log(responseUser);

                    let div = document.createElement("div");
                    div.classList.add("teamDiv");
                    div.innerHTML = `
                        <img src="../../public/img/kakao-login.png" class="img""/>
                        <div id="team-work-list-text">${username}님이 작업을 ${result[i].status}으로 변경하였습니다.</div>
                    `;
                    document.getElementsByClassName("team-work-list")[0].appendChild(div);
                }
            }
            console.log("팀활동 : ", response);
        } else {
            console.error("팀 활동 요청 실패 : ", response.data);
        }
    } catch (error) {
        console.error("팀 활동 요청 중 오류 발생 : ", error);
    }
})();

//피드백 요청
// (async function () {
//     const token = localStorage.getItem("token");
//     const project_id = localStorage.getItem("project_id");
//     try {
//         const response = await axios({
//             method: "GET",
//             url: "/api/project/board/get",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             params: {
//                 project_id,
//             },
//         });
//         console.log("팀활동 : ", response);
//         const { result, success } = response.data;
// if (success) {
//     for (i = 0; i < result.length; i++) {
//         let div = document.createElement("div");
//         div.innerHTML = ``;
//         //user_name, title, board_id,
//         document.getElementById("").appendChild(div);
//     }
// }
//     } catch (error) {
//         console.error("팀 활동 요청 중 오류 발생 : ", error);
//     }
// })();

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
    console.log(type);
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
    console.log(type);
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
    console.log(type);
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
        console.log(response);
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
        console.log(response);
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
// 멤버 추가 및 삭제
// async function addMember() {
//     const div = document.getElementById("member-main");
//     const Userimg = document.createElement("img");
//     Userimg.src = "../../public/img/edit.png";
//     Userimg.id = "pen-img";

//     input.onkeydown = async function (event) {
//         if (event.key !== "Enter") return;
//     };
// }
